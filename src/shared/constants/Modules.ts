import {
  Hospital, Briefcase, Scanning, Drop,
  Activity, Heart, Profile2User, Building3,
  ShieldSecurity, Wallet3, Moneys, Building, Headphone,
  Personalcard, Send2, Calendar, CalendarTick, Routing,
  Verify, Folder, ChartSquare, Box, Global, DocumentText, Messages
} from 'iconsax-react-native';
import { FlaskConical } from 'lucide-react-native';

export interface ModuleConfig {
  name: string;
  Icon: any;
  submodules?: string[];
}

export const MODULES: ModuleConfig[] = [
  { 
    name: 'Accounting', 
    Icon: Wallet3,
    submodules: ['Account', 'Chart of accounts', 'Expenses', 'Journal', 'Payment', 'Report']
  },
  { 
    name: 'Admin', 
    Icon: ShieldSecurity,
    submodules: ['Configure Email', 'Configure Feature', 'Configure Whatsapp', 'Employees', 'Location', 'Organization']
  },
  { 
    name: 'Analytics', 
    Icon: ChartSquare,
    submodules: ['Appointment', 'Client', 'Clinic', 'Finance', 'Inventory', 'Laboratory', 'NHMIS', 'Pharmacy', 'Report', 'Ward']
  },
  { 
    name: 'Appointments', 
    Icon: CalendarTick
  },
  { 
    name: 'Appt. Workflow', 
    Icon: Routing,
    submodules: ['Blood Bank', 'Clinic', 'CRM', 'Global', 'Immunization', 'Labour Ward', 'Pharmacy', 'Radiology', 'Referral', 'Theatre']
  },
  { 
    name: 'Art', 
    Icon: Heart,
    submodules: ['Appointment', 'Care Team', 'Embryo Vitrification Mgt', 'Enquiry Mgt', 'Laboratory Mgt', 'Prescription Mgt', 'Procedure Mgt', 'Profile Mgt', 'Report', 'Task']
  },
  { 
    name: 'Blood Bank', 
    Icon: Drop,
    submodules: ['Appointment', 'Inventory', 'Lab']
  },
  { 
    name: 'Case Management', 
    Icon: Personalcard,
    submodules: ['Case Audit Management']
  },
  { 
    name: 'Client', 
    Icon: Profile2User,
    submodules: ['Appointment', 'Client']
  },
  { 
    name: 'Clinic', 
    Icon: Hospital,
    submodules: ['Appointment', 'checkin', 'Referral']
  },
  { 
    name: 'Communication', 
    Icon: Messages,
    submodules: ['Email', 'Notifications', 'SMS']
  },
  { 
    name: 'Complaints', 
    Icon: Verify
  },
  { 
    name: 'Corporate', 
    Icon: Building,
    submodules: ['Beneficiary', 'Check In', 'Claims', 'Invoice', 'Policy', 'Premiums']
  },
  { 
    name: 'CRM', 
    Icon: Headphone,
    submodules: ['Analytics', 'Appointment', 'Invoice', 'Lead', 'Proposal', 'Prospect', 'SLA', 'Target', 'Templates']
  },
  { 
    name: 'Ecg', 
    Icon: Activity,
    submodules: ['Appointment', 'Checked-In', 'ECG Request', 'ECG Result']
  },
  { 
    name: 'Engagement', 
    Icon: Heart,
    submodules: ['Channel', 'Configuration', 'Questionnaires', 'Submissions']
  },
  { 
    name: 'Epidemiology', 
    Icon: Global,
    submodules: ['Case Definition', 'Map', 'Signals']
  },
  { 
    name: 'Finance', 
    Icon: Moneys,
    submodules: ['Authorization', 'Bands', 'Bill Services', 'Bill Tracker', 'Booked Services', 'Claims', 'Collections', 'HMO Authorization', 'PAYG', 'Payment', 'Revenue', 'Services', 'Tariffs', 'Transactions']
  },
  { 
    name: 'Global Dashboard', 
    Icon: Global,
    submodules: ['Facility Transactions', 'Lab Ref Values', 'Login Analytics', 'Organizations', 'PAYG Analytics']
  },
  { 
    name: 'Immunization', 
    Icon: Activity,
    submodules: ['Appointment', 'Checkin/out', 'Immunization schedule', 'Inventory', 'Report', 'Vaccine profile']
  },
  { 
    name: 'Inventory', 
    Icon: Box,
    submodules: ['Authorization', 'Bill Client', 'Dispensary', 'Issue Out', 'Product Entry', 'Requisition', 'Store Inventory', 'Transfer']
  },
  { 
    name: 'Laboratory', 
    Icon: FlaskConical,
    submodules: ['Lab Ref', 'Lab Result']
  },
  { 
    name: 'Managed Care', 
    Icon: ShieldSecurity,
    submodules: ['Accreditation', 'Beneficiary', 'Check In', 'Claims', 'Complaints', 'Corporate', 'Fund management', 'Health Plan', 'HIA', 'Invoice', 'Policy', 'Preauthorization', 'Premiums', 'Provider', 'Provider payment', 'Referrals', 'Report', 'Tariff']
  },
  { 
    name: 'Market Place', 
    Icon: Box
  },
  { 
    name: 'Patient Portal', 
    Icon: Profile2User,
    submodules: ['Buy', 'Chat', 'Profile', 'Read', 'Search', 'View']
  },
  { 
    name: 'Pharmacy', 
    Icon: Briefcase,
    submodules: ['Authorization', 'Dispensary', 'Issue Out', 'Pharmaco-vigilance', 'Product', 'Product Entry', 'Requisition', 'Store Inventory', 'Transfer', 'Vetted Prescriptions']
  },
  { 
    name: 'Provider Relation Management', 
    Icon: Profile2User,
    submodules: ['Enrollee Sensitization', 'Grievance', 'NHIA Statutory Report', 'Provider Accreditation', 'Provider Monitoring']
  },
  { 
    name: 'Radiology', 
    Icon: Scanning,
    submodules: ['Appointment', 'Checked-In', 'Radiology Request', 'Radiology Result', 'Search', 'Template']
  },
  { 
    name: 'Referral', 
    Icon: Send2,
    submodules: ['Incoming', 'Referral account', 'Setting']
  },
  { 
    name: 'Schedule', 
    Icon: Calendar,
    submodules: ['Calendar']
  },
  { 
    name: 'Theatre', 
    Icon: Profile2User,
    submodules: ['Appointments', 'Check In', 'Theatre List', 'Theatre Request']
  },
  { 
    name: 'Ward', 
    Icon: Building3,
    submodules: ['Admission List', 'Discharge List', 'Discharged Patients', 'In-Patient', 'Transfer']
  },
];

