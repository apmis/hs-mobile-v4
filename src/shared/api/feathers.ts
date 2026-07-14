
import io from "socket.io-client";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import authentication from "@feathersjs/authentication-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { queryClient } from './queryClient';

// Flag to prevent the global error hook from logging the user out 
// during the startup race condition when child components make unauthenticated calls
export let hasInitializedAuth = false;
export const setAuthInitialized = (val: boolean) => { hasInitializedAuth = val; };

const azure2 = "https://hs-backend-w6my.onrender.com/";

const socket = io(azure2, {
    transports: ["websocket", "polling"],
    forceNew: true,
});

// AsyncStorage.getItem("feathers-jwt").then(token => {
//     console.log("JWT Token from storage:", token);
// });

const feathersClient = feathers();

feathersClient.configure(socketio(socket, { timeout: 20000 }));

feathersClient.configure(
    authentication({
        storage: AsyncStorage,         // ✅ replaces window.localStorage
        storageKey: "feathers-jwt",

    })
);

feathersClient.hooks({
    error: {
        all: [
            async (context) => {
                const { error } = context;
                if (
                    error &&
                    context.path !== "authentication" &&
                    (error.name === "NotAuthenticated" ||
                        error.message === "NotAuthenticated" ||
                        error.code === 401)
                ) {
                    // If the message is exactly "Not authenticated", it means the request was sent WITHOUT a token.
                    // This ONLY happens if a child component makes an API call before `authenticate` has finished initializing the socket.
                    // If the token was actually invalid or expired, the message would be "jwt expired" or "invalid signature".
                    if (error.message === 'Not authenticated') {
                        console.log("[feathers.ts] Ignoring 'Not authenticated' on path", context.path, "(Race condition: request sent before socket was ready)");
                        return context;
                    }

                    // Ignore 401 errors if the app hasn't finished its initial auth check.
                    if (!hasInitializedAuth) {
                        console.log("[feathers.ts] Ignoring 401 on path", context.path, "because auth not initialized.");
                        return context;
                    }

                    console.log("[feathers.ts] GLOBAL HOOK TRIGGERED LOGOUT! Path:", context.path, "Error:", error.message);

                    await AsyncStorage.removeItem("feathers-jwt");
                    await AsyncStorage.removeItem("user");
                    await AsyncStorage.removeItem("cached-user");
                    await AsyncStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');

                    // Clear all react-query data so AuthGuard sees user as null
                    queryClient.clear();

                    router.replace('/(auth)/login');
                }
                return context;
            },
        ],
    },
});

export default feathersClient;
