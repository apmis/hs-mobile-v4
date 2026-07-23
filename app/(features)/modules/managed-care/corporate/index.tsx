import React, { useState } from 'react';
import ManagedCareScreenWrapper from '../_ScreenWrapper';
import ChatInterface, { Message } from '@/app/(features)/modules/_components/generic/ChatInterface';
import { useCopilotEngine } from '@/app/(features)/modules/_hooks/useCopilotEngine';
import { formatMessageTime } from '@/src/features/chat/utils';
import { useUser } from '@/src/shared/api/auth';
import feathersClient from '@/src/shared/api/feathers';
import Toast from 'react-native-toast-message';
import type { PaginatedResponse } from '@/src/shared/api/types';

export default function CorporateScreen() {
  const { data: user } = useUser();
  const [organisationPage, setOrganisationPage] = useState(0);
  const [organisationHasMore, setOrganisationHasMore] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null);
  const [selectedBand, setSelectedBand] = useState<any>(null);
  const [organisationOptions, setOrganisationOptions] = useState<{ id: string; label: string; org: any }[]>([]);
  const [bandOptions, setBandOptions] = useState<{ id: string; label: string; band: any }[]>([]);
  const [awaitingOrganisationSelection, setAwaitingOrganisationSelection] = useState(false);
  const [awaitingBandSelection, setAwaitingBandSelection] = useState(false);
  const ORGANISATION_PAGE_SIZE = 10;
  const ORGANISATION_FETCH_TIMEOUT_MS = 10000;
  const BAND_FETCH_TIMEOUT_MS = 10000;

  const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        reject(new Error(errorMessage));
      }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]) as Promise<T>;
  };

  const fetchOrganizationSuggestions = async (page: number = 0) => {
    if (!user?._id) {
      throw new Error('Unable to fetch organisations. Please sign in and try again.');
    }

    try {
      const response = await withTimeout(
        feathersClient.service('facility').find({
          query: {
            _id: { $ne: user?.facilityDetail?._id },
            $limit: ORGANISATION_PAGE_SIZE,
            $skip: page * ORGANISATION_PAGE_SIZE,
            $sort: { createdAt: -1 },
          },
        }) as Promise<PaginatedResponse<any>>,
        ORGANISATION_FETCH_TIMEOUT_MS,
        'The organisation request timed out. Please try again.'
      );

      if (!response || !Array.isArray(response.data)) {
        throw new Error('Received invalid organisation data from the server.');
      }

      return response.data;
    } catch (error: any) {
      console.error('[CorporateScreen] fetchOrganizationSuggestions failed:', error);
      throw new Error(
        error?.message || 'Failed to fetch corporate organisations. Please check your connection and try again.'
      );
    }
  };

  const fetchBandOptions = async () => {
    try {
      const response = await withTimeout(
        feathersClient.service('bands').find({
          query: {
            facility: user?.facilityDetail?._id,
            bandType: 'Corporate Sponsor',
            $sort: { category: 1 },
            $limit: 100,
          },
        }) as Promise<PaginatedResponse<any>>,
        BAND_FETCH_TIMEOUT_MS,
        'The band request timed out. Please try again.'
      );

      if (!response || !Array.isArray(response.data)) {
        throw new Error('Received invalid band data from the server.');
      }

      return response.data;
    } catch (error: any) {
      console.error('[CorporateScreen] fetchBandOptions failed:', error);
      throw new Error(
        error?.message || 'Failed to fetch bands. Please check your connection and try again.'
      );
    }
  };

  const runBackendAction = async (actionFn: () => Promise<Message>) => {
    try {
      return await actionFn();
    } catch (error: any) {
      const messageText = error?.message
        ? `I could not complete that request: ${error.message}`
        : 'I could not complete that request. Please try again.';

      return {
        id: Date.now().toString(),
        isMe: false,
        sender: 'Managed care for coporates',
        time: formatMessageTime(new Date()),
        text: messageText,
        isError: true,
        avatar: require('@/assets/images/Healthstack.png'),
        suggestedActions: ['Try again'],
      };
    }
  };

  const initialMessages: Message[] = [
    {
      id: 'init-corporate',
      sender: 'Managed care for coporates',
      text: "### Welcome to Corporate Management\n\nThis section handles all Corporate Organisations. Here you can view a list of organisations, check their details such as claims, policies, and statuses, or onboard a new corporate entity.\n\n**How can I help you today?**",
      time: formatMessageTime(new Date()),
      isMe: false,
      avatar: require('@/assets/images/Healthstack.png'),
      suggestedActions: [
        'List of corporate organisations',
        'Add new corporate'
      ]
    }
  ];

  const { messages, isTyping, handleSendText, handleAction, appendMessage } = useCopilotEngine({
    moduleName: 'Corporate',
    initialMessages,
    actionHandlers: {
      'Add new corporate': async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
          id: Date.now().toString(),
          isMe: false,
          sender: 'Managed care for coporates',
          time: formatMessageTime(new Date()),
          text: 'To add a new corporate organisation, the organisation and bands will need to be selected.',
          avatar: require('@/assets/images/Healthstack.png'),
          suggestedActions: ['Select organisation', 'Select bands']
        };
      },
      'Select organisation': async () => runBackendAction(async () => {
        const organizations = await fetchOrganizationSuggestions();
        const options = organizations.slice(0, ORGANISATION_PAGE_SIZE).map((org: any, idx: number) => {
          const label = org.facilityName || org.name || `Organization ${idx + 1}`;
          return {
            id: org._id || `${Date.now()}-${idx}`,
            label,
            org,
          };
        });

        setOrganisationOptions(options);
        setAwaitingOrganisationSelection(true);

        const orgOptionsText = options.map((opt) => {
          const details = opt.org.facilityType ? ` (${opt.org.facilityType})` : '';
          return `- ${opt.label}${details}`;
        }).join('\n');

        const text = options.length > 0
          ? `Here are some corporate organisations I found. Tap one of the options below to select an organisation and continue to bands:`
          : 'I could not find any organisations right now. Please try again later or refine your request.';

        return {
          id: Date.now().toString(),
          isMe: false,
          sender: 'Managed care for coporates',
          time: formatMessageTime(new Date()),
          text,
          avatar: require('@/assets/images/Healthstack.png'),
          suggestedActions: options.length > 0
            ? options.map((opt) => opt.label)
            : ['Try again'],
        };
      }),
      'Select bands': async () => {
        if (!selectedOrganization) {
          return {
            id: Date.now().toString(),
            isMe: false,
            sender: 'Managed care for coporates',
            time: formatMessageTime(new Date()),
            text: 'Please select an organisation first before choosing bands.',
            avatar: require('@/assets/images/Healthstack.png'),
            suggestedActions: ['Select organisation'],
          };
        }

        const bands = await fetchBandOptions();
        const options = bands.map((band: any) => ({
          id: band._id,
          label: band.name || band.bandName || `Band ${band._id}`,
          band,
        }));

        setBandOptions(options);
        setAwaitingBandSelection(true);

        return {
          id: Date.now().toString(),
          isMe: false,
          sender: 'Managed care for coporates',
          time: formatMessageTime(new Date()),
          text: `Great. You've selected ${selectedOrganization.label}. Please choose a band from the list below:`,
          avatar: require('@/assets/images/Healthstack.png'),
          suggestedActions: options.length > 0
            ? options.map((opt) => opt.label)
            : ['No bands found'],
        };
      }
      ,
      'Yes, proceed': async () => runBackendAction(async () => {
        if (!selectedOrganization || !selectedBand) {
          return {
            id: Date.now().toString(),
            isMe: false,
            sender: 'Managed care for coporates',
            time: formatMessageTime(new Date()),
            text: 'Please select an organisation and a band before proceeding.',
            avatar: require('@/assets/images/Healthstack.png'),
            suggestedActions: ['Select organisation', 'Select bands'],
          };
        }

        const bandName = selectedBand.name || selectedBand.bandName || selectedBand.label || selectedBand;
        const corporateData = {
          facility: user?.facilityDetail?._id,
          organization: selectedOrganization.org?._id || selectedOrganization.id,
          relationshiptype: 'sponsor',
          band: bandName,
        };

        // Check if this organization is already a corporate client (avoid duplicates)
        const existing = await withTimeout(
          feathersClient.service('client').find({
            query: {
              facility: user?.facilityDetail?._id,
              organization: selectedOrganization.org?._id || selectedOrganization.id,
              relationshiptype: 'sponsor',
              $limit: 1,
            },
          }) as Promise<PaginatedResponse<any>>,
          10000,
          'Checking existing corporate timed out. Please try again.'
        );

        if (existing && Array.isArray(existing.data) && existing.data.length > 0) {
          Toast.show({ type: 'info', text1: 'Facility Already a Corporate Organization' });
          return {
            id: Date.now().toString(),
            isMe: false,
            sender: 'Managed care for coporates',
            time: formatMessageTime(new Date()),
            text: 'This facility is already a Corporate Organization.',
            avatar: require('@/assets/images/Healthstack.png'),
            suggestedActions: [],
          };
        }

        await withTimeout(
          feathersClient.service('organizationclient').create(corporateData) as Promise<any>,
          10000,
          'Submitting corporate organisation timed out. Please try again.'
        );

        Toast.show({ type: 'success', text1: 'Organization added successfully' });
        return {
          id: Date.now().toString(),
          isMe: false,
          sender: 'Managed care for coporates',
          time: formatMessageTime(new Date()),
          text: 'Corporate organisation added successfully.',
          avatar: require('@/assets/images/Healthstack.png'),
          suggestedActions: [],
        };
      }),
      'No, change data': async () => {
        setAwaitingBandSelection(false);
        setBandOptions([]);
        return {
          id: Date.now().toString(),
          isMe: false,
          sender: 'Managed care for coporates',
          time: formatMessageTime(new Date()),
          text: 'You can change your selection by reselecting the organisation or the band.',
          avatar: require('@/assets/images/Healthstack.png'),
          suggestedActions: ['Select organisation', 'Select bands'],
        };
      }
    }
  });

  const handleOrganisationSelection = async (text: string) => {
    const matchedOption = organisationOptions.find((opt) => opt.label === text);
    if (!matchedOption) {
      return handleSendText(text);
    }

    setSelectedOrganization(matchedOption);
    setSelectedBand(null);
    setAwaitingOrganisationSelection(false);
    setOrganisationOptions([]);

    const selectedOrgText = `You selected ${matchedOption.label}. Now please select bands to continue.`;
    const message: Message = {
      id: Date.now().toString(),
      isMe: false,
      sender: 'Managed care for coporates',
      time: formatMessageTime(new Date()),
      text: selectedOrgText,
      avatar: require('@/assets/images/Healthstack.png'),
      suggestedActions: ['Select bands'],
    };

    appendMessage(message);
  };

  const handleBandSelection = async (text: string) => {
    const matchedBand = bandOptions.find((opt) => opt.label === text);
    if (!matchedBand) {
      return handleSendText(text);
    }

    if (!selectedOrganization) {
      return handleAction('Select bands');
    }

    setSelectedBand(matchedBand.band);
    setAwaitingBandSelection(false);
    setBandOptions([]);

    const confirmationMessage: Message = {
      id: Date.now().toString(),
      isMe: false,
      sender: 'Managed care for coporates',
      time: formatMessageTime(new Date()),
      text: `You selected ${matchedBand.label} for ${selectedOrganization.label}. Are you sure the data entered is correct and ready to proceed?`,
      avatar: require('@/assets/images/Healthstack.png'),
      suggestedActions: ['Yes, proceed', 'No, change data'],
    };

    appendMessage(confirmationMessage);
  };

  return (
    <ManagedCareScreenWrapper title="Corporate">
      <ChatInterface
        messages={messages}
        isTyping={isTyping}
        onSend={(text) => {
          if (awaitingOrganisationSelection && organisationOptions.some((opt) => opt.label === text)) {
            handleOrganisationSelection(text);
            return;
          }

          if (awaitingBandSelection && bandOptions.some((opt) => opt.label === text)) {
            handleBandSelection(text);
            return;
          }

          if (
            text === 'Add new corporate' ||
            text === 'Select organisation' ||
            text === 'Select bands' ||
            text === 'Yes, proceed' ||
            text === 'No, change data'
          ) {
            handleAction(text);
          } else {
            // "List of corporate organisations" and natural language queries go to the AI
            handleSendText(text);
          }
        }}
      />
    </ManagedCareScreenWrapper>
  );
}
