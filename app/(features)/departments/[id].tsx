import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/app/shared/hooks/useThemeColor';
import AppHeader from '@/app/shared/components/AppHeader';

// Department Views
import AccountingView from './accounting/_MainView';
import AdminView from './admin/_MainView';
import AppointmentsView from './appointments/_MainView';
import ApptWorkflowView from './appt-workflow/_MainView';
import BloodBankView from './blood-bank/_MainView';
import CaseManagementView from './case-management/_MainView';
import ClientsView from './clients/_MainView';
import ClinicView from './clinic/_MainView';
import CorporateView from './corporate/_MainView';
import CrmView from './crm/_MainView';
import DocumentationView from './documentation/_MainView';
import EcgView from './ecg/_MainView';
import FinanceView from './finance/_MainView';
import ImmunizationView from './immunization/_MainView';
import LaboratoryView from './laboratory/_MainView';
import ManagedCareView from './managed-care/_MainView';
import PharmacyView from './pharmacy/_MainView';
import RadiologyView from './radiology/_MainView';
import ReferralView from './referral/_MainView';
import ScheduleView from './schedule/_MainView';
import TheatreView from './theatre/_MainView';
import WardView from './ward/_MainView';
import ChatInterface from './_components/generic/ChatInterface';

export default function DepartmentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // console.log('id', id);

  // Capitalize department name correctly
  const rawId = typeof id === 'string' ? id : 'radiology';
  const deptName = rawId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const getMoreOptions = () => {
    switch (deptName) {
      case 'Clinic':
        return ['Appointments', 'Check-ins', 'Referrals'];
      case 'Managed Care':
        return [
          'Accreditation',
          'Beneficiary',
          'Check In',
          'Claims',
          'Complaints',
          'Corporate',
          'Fund management',
          'Health Plan',
          'HIA',
          'Invoice',
          'Policy',
          'Preauthorization',
          'Premiums',
          'Provider',
          'Provider payment',
          'Referrals',
          'Report',
          'Tariff'
        ];
      default:
        return ['Search', 'Overview', 'Reports', 'Settings'];
    }
  };

  const handleOptionPress = (option: string) => {
    const slug = option.toLowerCase().replace(/ /g, '-');

    // Only Managed Care has nested route folders currently
    if (deptName === 'Managed Care') {
      router.push(`/departments/managed-care/${slug}`);
    } else {
      console.log(`Route /departments/${rawId}/${slug} not implemented yet`);
      // You could also show an alert here: Alert.alert('Coming Soon', `${option} is not yet available for ${deptName}.`);
    }
  };

  const backgroundColor = useThemeColor({}, 'background');

  // STRATEGY PATTERN: Select the view based on the department name
  const renderDepartmentContent = () => {
    switch (deptName) {
      case 'Accounting':
        return <AccountingView />;
      case 'Admin':
        return <AdminView />;
      case 'Appointments':
        return <AppointmentsView />;
      case 'Appt Workflow':
        return <ApptWorkflowView />;
      case 'Blood Bank':
        return <BloodBankView />;
      case 'Case Management':
        return <CaseManagementView />;
      case 'Clients':
        return <ClientsView />;
      case 'Clinic':
        return <ClinicView />;
      case 'Corporate':
        return <CorporateView />;
      case 'Crm':
        return <CrmView />;
      case 'Documentation':
        return <DocumentationView />;
      case 'Ecg':
        return <EcgView />;
      case 'Finance':
        return <FinanceView />;
      case 'Immunization':
        return <ImmunizationView />;
      case 'Laboratory':
        return <LaboratoryView />;
      case 'Managed Care':
        return <ManagedCareView />;
      case 'Pharmacy':
        return <PharmacyView />;
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
        // Fallback for all other departments is just the standard ChatInterface
        return <ChatInterface />;
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
          title={deptName}
          showBack={true}
          showSearch={false}
          showIcons={true}
          showLocation={true}
          showMoreOptions={!!getMoreOptions()}
          moreOptions={getMoreOptions()}
          onOptionPress={handleOptionPress}
        />

        {/* Dynamic Department Content */}
        {renderDepartmentContent()}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
