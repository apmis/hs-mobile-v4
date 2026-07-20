import React from 'react';
import { KeyboardAvoidingView, Platform, View, Text } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/src/shared/hooks/useThemeColor';
import AppHeader from '@/src/shared/components/AppHeader';
import { MODULES } from '@/src/shared/constants/Modules';
import { useEffect } from 'react';
import { useUser } from '@/src/shared/api/auth';
import { useLocationStore } from '@/src/shared/store/useLocationStore';

// Module Views
import ChatInterface from './_components/generic/ChatInterface';
import AccountingView from './accounting/_MainView';
import AdminView from './admin/_MainView';
import AnalyticsView from './analytics/_MainView';
import AppointmentsView from './appointments/_MainView';
import ApptWorkflowView from './appt-workflow/_MainView';
import ArtView from './art/_MainView';
import BloodBankView from './blood-bank/_MainView';
import CaseManagementView from './case-management/_MainView';
import ClientView from './client/_MainView';
import ClinicView from './clinic/_MainView';
import CommunicationView from './communication/_MainView';
import ComplaintsView from './complaints/_MainView';
import CorporateView from './corporate/_MainView';
import CRMView from './crm/_MainView';
import EcgView from './ecg/_MainView';
import EngagementView from './engagement/_MainView';
import EpidemiologyView from './epidemiology/_MainView';
import FinanceView from './finance/_MainView';
import GlobalDashboardView from './global-dashboard/_MainView';
import ImmunizationView from './immunization/_MainView';
import InventoryView from './inventory/_MainView';
import LaboratoryView from './laboratory/_MainView';
import ManagedCareView from './managed-care/_MainView';
import MarketPlaceView from './market-place/_MainView';
import PatientPortalView from './patient-portal/_MainView';
import PharmacyView from './pharmacy/_MainView';
import ProviderRelationManagementView from './provider-relation-management/_MainView';
import RadiologyView from './radiology/_MainView';
import ReferralView from './referral/_MainView';
import ScheduleView from './schedule/_MainView';
import TheatreView from './theatre/_MainView';
import WardView from './ward/_MainView';


export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // console.log('id', id);

  // Capitalize module name correctly
  const rawId = typeof id === 'string' ? id : 'radiology';
  const moduleName = rawId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const { data: user } = useUser();
  const { setLocations, switchModule } = useLocationStore();

  useEffect(() => {
    if (user?.locations) {
      setLocations(user.locations);
      switchModule(moduleName);
    }
  }, [user?.locations, moduleName]);

  const getMoreOptions = () => {
    const activeModule = MODULES.find(m => m.name === moduleName);
    if (activeModule?.submodules) {
      return activeModule.submodules;
    }
    return ['Search', 'Overview', 'Reports', 'Settings'];
  };

  const handleOptionPress = (option: string) => {
    const slug = option.toLowerCase().replace(/ /g, '-');

    // Only Managed Care has nested route folders currently
    if (moduleName === 'Managed Care') {
      router.push(`/modules/managed-care/${slug}`);
    } else {
      console.log(`Route /modules/${rawId}/${slug} not implemented yet`);
      // You could also show an alert here: Alert.alert('Coming Soon', `${option} is not yet available for ${moduleName}.`);
    }
  };

  const backgroundColor = useThemeColor({}, 'background');

  // STRATEGY PATTERN: Select the view based on the module name
  const renderModuleContent = () => {
    switch (moduleName) {
      case 'Accounting':
        return <AccountingView />;
      case 'Admin':
        return <AdminView />;
      case 'Analytics':
        return <AnalyticsView />;
      case 'Appointments':
        return <AppointmentsView />;
      case 'Appt. Workflow':
        return <ApptWorkflowView />;
      case 'Art':
        return <ArtView />;
      case 'Blood Bank':
        return <BloodBankView />;
      case 'Case Management':
        return <CaseManagementView />;
      case 'Client':
        return <ClientView />;
      case 'Clinic':
        return <ClinicView />;
      case 'Communication':
        return <CommunicationView />;
      case 'Complaints':
        return <ComplaintsView />;
      case 'Corporate':
        return <CorporateView />;
      case 'CRM':
        return <CRMView />;
      case 'Ecg':
        return <EcgView />;
      case 'Engagement':
        return <EngagementView />;
      case 'Epidemiology':
        return <EpidemiologyView />;
      case 'Finance':
        return <FinanceView />;
      case 'Global Dashboard':
        return <GlobalDashboardView />;
      case 'Immunization':
        return <ImmunizationView />;
      case 'Inventory':
        return <InventoryView />;
      case 'Laboratory':
        return <LaboratoryView />;
      case 'Managed Care':
        return <ManagedCareView />;
      case 'Market Place':
        return <MarketPlaceView />;
      case 'Patient Portal':
        return <PatientPortalView />;
      case 'Pharmacy':
        return <PharmacyView />;
      case 'Provider Relation Management':
        return <ProviderRelationManagementView />;
      case 'Radiology':
        return <RadiologyView />;
      case 'Referral':
        return <ReferralView />;
      case 'Schedule':
        return <ScheduleView />;
      case 'Theatre':
        return <TheatreView />;
      case 'Ward':
        return <WardView />;
      default:
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Module not found.</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <Stack.Screen options={{ headerShown: false }} />

        <AppHeader
          title={moduleName}
          showBack={true}
          showSearch={false}
          showIcons={true}
          showLocation={true}
          showMoreOptions={!!getMoreOptions()}
          moreOptions={getMoreOptions()}
          onOptionPress={handleOptionPress}
          moduleLocationType={moduleName}
        />

        {/* Dynamic Module Content */}
        {renderModuleContent()}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
