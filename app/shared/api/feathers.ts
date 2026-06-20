
import io from "socket.io-client";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import authentication from "@feathersjs/authentication-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

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
                    await AsyncStorage.removeItem("feathers-jwt"); // ✅ async, await it
                    await AsyncStorage.setItem("user", "");
                    // ✅ Use your navigation solution here instead of window.location
                    // e.g. router.replace('/') if using Expo Router

                    router.replace('/(auth)/login');
                }
                return context;
            },
        ],
    },
});

export default feathersClient;
