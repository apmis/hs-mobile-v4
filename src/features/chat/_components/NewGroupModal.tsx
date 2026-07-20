import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/src/shared/hooks/useThemeColor';
import { styles } from './style';
import { useStaffs, useCreateChannel, useFacilities, useLocations, useClients } from '../_api/chatCreation';
import Input from '@/src/shared/components/ui/Input';
import Button from '@/src/shared/components/ui/Button';
import TopSearchBar from '@/src/shared/components/TopSearchBar';
import { useUser } from '@/src/shared/api/auth';

interface NewGroupModalProps {
  visible: boolean;
  onClose: () => void;
}

const CHANNEL_TYPES = ["Unit", "Location", "Department", "Branch", "Organization", "Global", "Client"];

export default function NewGroupModal({ visible, onClose }: NewGroupModalProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: user } = useUser();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');

  const [channelType, setChannelType] = useState('Unit');
  const [channelName, setChannelName] = useState('');
  const [channelDesc, setChannelDesc] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedStaffs, setSelectedStaffs] = useState<string[]>([]);

  // Organization / External Facility
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [facilitySearchQuery, setFacilitySearchQuery] = useState('');

  // Location
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Department
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [departmentSearchQuery, setDepartmentSearchQuery] = useState('');

  // Clients
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  // Data hooks
  const { data: facilities = [], isLoading: loadingFacilities } = useFacilities(facilitySearchQuery);
  const { data: locations = [], isLoading: loadingLocations } = useLocations();
  const { data: clients = [], isLoading: loadingClients } = useClients(clientSearchQuery);

  const { data: staffs = [], isLoading: staffsLoading } = useStaffs(
    selectedFacility?._id,
    channelType === 'Location' ? selectedLocation : undefined
  );
  const createChannel = useCreateChannel();

  const availableDepartments = Array.from(new Set(staffs.map((s: any) => s.department).filter(Boolean))) as string[];

  const toggleStaff = (staffId: string) => {
    if (selectedStaffs.includes(staffId)) {
      setSelectedStaffs(selectedStaffs.filter(id => id !== staffId));
    } else {
      setSelectedStaffs([...selectedStaffs, staffId]);
    }
  };

  const toggleClient = (clientId: string) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  const handleChannelTypeChange = (type: string) => {
    setChannelType(type);

    // Reset inputs
    setChannelName('');
    setChannelDesc('');
    setSearchQuery('');
    setFacilitySearchQuery('');
    setClientSearchQuery('');
    setDepartmentSearchQuery('');

    // Reset selections
    setSelectedStaffs([]);
    setSelectedClients([]);
    setSelectedFacility(null);

    // Apply defaults
    setSelectedLocation('');
    setSelectedDepartment('');
  };

  const filteredStaffs = staffs.filter((staff: any) => {
    if (channelType === 'Department' && selectedDepartment) {
      if (staff.department !== selectedDepartment) return false;
    }

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = `${staff.firstname || ''} ${staff.lastname || ''}`.toLowerCase();
    const profession = (staff.profession || '').toLowerCase();
    return name.includes(q) || profession.includes(q);
  });

  const handleCreate = async () => {
    if (!channelName.trim()) {
      alert("Please provide a Channel Name");
      return;
    }

    try {
      const selectedStaffObjects = staffs.filter((s: any) => selectedStaffs.includes(s._id));
      const selectedClientObjects = clients.filter((c: any) => selectedClients.includes(c._id));

      const payload = {
        channel_type: channelType,
        channel_name: channelName,
        channel_description: channelDesc,
        staffs: selectedStaffObjects,
        clients: selectedClientObjects
      };

      const chatRoom = await createChannel.mutateAsync(payload);
      onClose();
      router.push(`/chat/${chatRoom._id}`);
    } catch (error) {
      console.error('Failed to create channel:', error);
      alert("Failed to create channel");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(12), borderBottomWidth: 1, borderBottomColor: borderColor }}>
          <TouchableOpacity onPress={onClose} style={{ padding: moderateScale(4), marginRight: moderateScale(12) }}>
            <ArrowLeft size={moderateScale(24)} color={textColor} />
          </TouchableOpacity>
          <Text style={{ fontSize: moderateScale(18), fontWeight: '600', color: textColor }}>Create Channel</Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: moderateScale(16), paddingBottom: insets.bottom + moderateScale(40) }}>

          <Text style={{ fontSize: moderateScale(14), fontWeight: '500', color: textColor, marginBottom: moderateScale(8) }}>Channel Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: moderateScale(16) }}>
            {CHANNEL_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => handleChannelTypeChange(type)}
                style={{
                  paddingHorizontal: moderateScale(16),
                  paddingVertical: moderateScale(8),
                  borderRadius: moderateScale(20),
                  backgroundColor: channelType === type ? primaryColor : 'transparent',
                  borderWidth: 1,
                  borderColor: channelType === type ? primaryColor : borderColor,
                  marginRight: moderateScale(8)
                }}
              >
                <Text style={{ color: channelType === type ? '#fff' : textColor, fontWeight: '500' }}>{type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Input
            label="Channel Name"
            placeholder="e.g. General Announcements"
            value={channelName}
            onChangeText={setChannelName}
            containerStyle={{ marginBottom: moderateScale(16) }}
          />

          <Input
            label="Channel Description"
            placeholder="e.g. A place for all updates"
            value={channelDesc}
            onChangeText={setChannelDesc}
            containerStyle={{ marginBottom: moderateScale(24) }}
          />

          {channelType === 'Department' && (
            <View style={{ marginBottom: moderateScale(24) }}>
              <Text style={{ fontSize: moderateScale(14), fontWeight: '500', color: textColor, marginBottom: moderateScale(8) }}>Department</Text>
              {staffsLoading ? (
                <ActivityIndicator size="small" color={primaryColor} />
              ) : availableDepartments.length === 0 ? (
                <View style={{ borderWidth: 1, borderColor, padding: moderateScale(12), borderRadius: moderateScale(8), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', opacity: 0.5 }}>
                  <Text style={{ color: textSecondaryColor, fontSize: moderateScale(14), fontStyle: 'italic' }}>No departments found</Text>
                  <ChevronDown size={moderateScale(20)} color={textSecondaryColor} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setShowDepartmentModal(true)}
                  style={{ borderWidth: 1, borderColor, padding: moderateScale(12), borderRadius: moderateScale(8), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Text style={{ color: selectedDepartment ? textColor : textSecondaryColor, fontSize: moderateScale(14) }}>
                    {selectedDepartment || "All Departments"}
                  </Text>
                  <ChevronDown size={moderateScale(20)} color={textSecondaryColor} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {channelType === 'Location' && (
            <View style={{ marginBottom: moderateScale(24) }}>
              <Text style={{ fontSize: moderateScale(14), fontWeight: '500', color: textColor, marginBottom: moderateScale(8) }}>Location</Text>
              {loadingLocations ? (
                <ActivityIndicator size="small" color={primaryColor} />
              ) : locations.length === 0 ? (
                <View style={{ borderWidth: 1, borderColor, padding: moderateScale(12), borderRadius: moderateScale(8), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', opacity: 0.5 }}>
                  <Text style={{ color: textSecondaryColor, fontSize: moderateScale(14), fontStyle: 'italic' }}>No locations found</Text>
                  <ChevronDown size={moderateScale(20)} color={textSecondaryColor} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setShowLocationModal(true)}
                  style={{ borderWidth: 1, borderColor, padding: moderateScale(12), borderRadius: moderateScale(8), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Text style={{ color: selectedLocation ? textColor : textSecondaryColor, fontSize: moderateScale(14) }}>
                    {selectedLocation ? locations.find((l: any) => l._id === selectedLocation)?.name : "All Locations"}
                  </Text>
                  <ChevronDown size={moderateScale(20)} color={textSecondaryColor} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {channelType === 'Client' && (
            <View style={{ marginBottom: moderateScale(24) }}>
              <Text style={{ fontSize: moderateScale(14), fontWeight: '500', color: textColor, marginBottom: moderateScale(8) }}>Add Clients</Text>
              <Input
                placeholder="Search by name, phone, email..."
                value={clientSearchQuery}
                onChangeText={setClientSearchQuery}
                containerStyle={{ marginBottom: moderateScale(8) }}
              />

              {/* Selected Clients Pills */}
              {selectedClients.length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: moderateScale(12) }}>
                  {selectedClients.map(clientId => {
                    const clientObj = clients.find((c: any) => c._id === clientId);
                    if (!clientObj) return null;
                    return (
                      <TouchableOpacity
                        key={clientId}
                        onPress={() => toggleClient(clientId)}
                        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: primaryColor + '20', paddingHorizontal: moderateScale(10), paddingVertical: moderateScale(6), borderRadius: moderateScale(16), marginRight: moderateScale(8), marginBottom: moderateScale(8) }}
                      >
                        <Text style={{ color: primaryColor, fontSize: moderateScale(12), fontWeight: '500', marginRight: moderateScale(4) }}>{clientObj.firstname} {clientObj.lastname}</Text>
                        <Check size={moderateScale(12)} color={primaryColor} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {clientSearchQuery.length > 3 && (
                <View style={{ maxHeight: moderateScale(150), borderWidth: 1, borderColor, borderRadius: moderateScale(8), backgroundColor }}>
                  <ScrollView nestedScrollEnabled>
                    {loadingClients ? (
                      <ActivityIndicator size="small" color={primaryColor} style={{ padding: moderateScale(16) }} />
                    ) : clients.length === 0 ? (
                      <Text style={{ textAlign: 'center', color: textSecondaryColor, padding: moderateScale(16) }}>No clients found.</Text>
                    ) : (
                      clients.map((client: any) => {
                        const isSelected = selectedClients.includes(client._id);
                        return (
                          <TouchableOpacity
                            key={client._id}
                            style={{ padding: moderateScale(12), borderBottomWidth: 1, borderBottomColor: borderColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                            onPress={() => toggleClient(client._id)}
                          >
                            <View>
                              <Text style={{ fontSize: moderateScale(14), color: textColor, fontWeight: '500' }}>{client.firstname} {client.lastname}</Text>
                              <Text style={{ fontSize: moderateScale(12), color: textSecondaryColor }}>{client.phone || client.email}</Text>
                            </View>
                            {isSelected && <Check size={moderateScale(16)} color={primaryColor} />}
                          </TouchableOpacity>
                        )
                      })
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: moderateScale(12) }}>
            <Text style={{ fontSize: moderateScale(14), fontWeight: '500', color: textColor }}>
              {channelType === 'Location' && selectedLocation
                ? (user?.locations?.some((l: any) => (l._id || l) === selectedLocation)
                  ? `Select members from your location (${locations.find((l: any) => l._id === selectedLocation)?.name || ''})`
                  : `Select members from ${locations.find((l: any) => l._id === selectedLocation)?.name || ''}`)
                : channelType === 'Department' && selectedDepartment
                  ? (user?.department === selectedDepartment
                    ? `Select members from your department (${selectedDepartment})`
                    : `Select members from ${selectedDepartment}`)
                  : "Select Staff Members"}
            </Text>
          </View>

          {channelType === 'Organization' && (
            <View style={{ marginBottom: moderateScale(16) }}>
              {!selectedFacility ? (
                <View>
                  <Text style={{ fontSize: moderateScale(14), fontWeight: '500', color: textColor, marginBottom: moderateScale(8) }}>Organization (Required)</Text>
                  <Input
                    placeholder="Search for an organization..."
                    value={facilitySearchQuery}
                    onChangeText={setFacilitySearchQuery}
                  />
                </View>
              ) : (
                <View>
                  <Text style={{ fontSize: moderateScale(14), fontWeight: '500', color: textSecondaryColor, marginBottom: moderateScale(4) }}>Selected Organization</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#eef2ff', padding: moderateScale(12), borderRadius: moderateScale(8) }}>
                    <Text style={{ flex: 1, color: primaryColor, fontWeight: '600' }}>{selectedFacility.facilityName}</Text>
                    <TouchableOpacity onPress={() => setSelectedFacility(null)}>
                      <Text style={{ color: primaryColor, fontWeight: 'bold' }}>Change</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {facilitySearchQuery.length > 3 && !selectedFacility && (
                <View style={{ marginTop: moderateScale(8) }}>
                  {loadingFacilities ? (
                    <ActivityIndicator size="small" color={primaryColor} />
                  ) : facilities.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: textSecondaryColor, marginVertical: moderateScale(8) }}>No organizations found.</Text>
                  ) : (
                    facilities.map((facility: any) => (
                      <TouchableOpacity
                        key={facility._id}
                        style={{ padding: moderateScale(12), borderBottomWidth: 1, borderBottomColor: borderColor }}
                        onPress={() => {
                          setSelectedFacility(facility);
                          setFacilitySearchQuery('');
                        }}
                      >
                        <Text style={{ fontSize: moderateScale(16), color: textColor, fontWeight: '500' }}>{facility.facilityName}</Text>
                        <Text style={{ fontSize: moderateScale(13), color: textSecondaryColor }}>{facility.facilityType || 'Facility'}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}
            </View>
          )}

          {!(channelType === 'Organization' && !selectedFacility) && (
            <>
              {staffs.length > 0 && (
                <View style={{ marginBottom: moderateScale(16) }}>
                  <TopSearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    hideAskAI={true}
                  />
                </View>
              )}
              {staffsLoading ? (
                <ActivityIndicator size="small" color={primaryColor} />
              ) : filteredStaffs.length === 0 ? (
                <View style={{ marginBottom: moderateScale(24), padding: moderateScale(24), alignItems: 'center' }}>
                  <Text style={{ color: textSecondaryColor, fontSize: moderateScale(14), fontStyle: 'italic', textAlign: 'center' }}>
                    No staff members found for the selected criteria.
                  </Text>
                </View>
              ) : (
                <View style={{ marginBottom: moderateScale(24) }}>
                  {filteredStaffs.map((staff: any) => {
                    const isSelected = selectedStaffs.includes(staff._id);
                    return (
                      <TouchableOpacity
                        key={staff._id}
                        onPress={() => toggleStaff(staff._id)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingVertical: moderateScale(12),
                          borderBottomWidth: 1,
                          borderBottomColor: borderColor
                        }}
                      >
                        <View style={{
                          width: moderateScale(24),
                          height: moderateScale(24),
                          borderRadius: moderateScale(12),
                          borderWidth: 1,
                          borderColor: isSelected ? primaryColor : borderColor,
                          backgroundColor: isSelected ? primaryColor : 'transparent',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: moderateScale(12)
                        }}>
                          {isSelected && <Check size={moderateScale(14)} color="#fff" />}
                        </View>
                        <View>
                          <Text style={{ fontSize: moderateScale(16), color: textColor, fontWeight: '500' }}>
                            {staff.firstname} {staff.lastname}
                          </Text>
                          <Text style={{ fontSize: moderateScale(13), color: textSecondaryColor }}>
                            {staff.profession || 'Staff'} {staff.department ? `- ${staff.department}` : ''}
                          </Text>
                          {staff.facilityDetail?.facilityName && staff.facilityDetail._id !== user?.facilityDetail?._id && (
                            <Text style={{ fontSize: moderateScale(12), color: primaryColor, marginTop: moderateScale(2), fontWeight: '500' }}>
                              {staff.facilityDetail.facilityName}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </>
          )}

          <Button
            title="Create Channel"
            onPress={handleCreate}
            disabled={
              createChannel.isPending ||
              channelName.trim() === '' ||
              (channelType === 'Organization' && !selectedFacility) ||
              (selectedStaffs.length === 0 && selectedClients.length === 0)
            }
            loading={createChannel.isPending}
            style={{ marginTop: moderateScale(16) }}
          />
        </ScrollView>

        {/* Bottom Sheet for Department Selection */}
        {showDepartmentModal && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end', zIndex: 100 }}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowDepartmentModal(false)} />
            <View style={{ backgroundColor, borderTopLeftRadius: moderateScale(16), borderTopRightRadius: moderateScale(16), padding: moderateScale(16), maxHeight: '60%' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: moderateScale(16) }}>
                <Text style={{ fontSize: moderateScale(18), fontWeight: '600', color: textColor }}>Select Department</Text>
                <TouchableOpacity onPress={() => setShowDepartmentModal(false)}>
                  <Text style={{ color: primaryColor, fontWeight: '600', fontSize: moderateScale(16) }}>Done</Text>
                </TouchableOpacity>
              </View>
              <Input
                placeholder="Search departments..."
                value={departmentSearchQuery}
                onChangeText={setDepartmentSearchQuery}
                containerStyle={{ marginBottom: moderateScale(12) }}
              />
              <ScrollView>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDepartment('');
                    setShowDepartmentModal(false);
                  }}
                  style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: moderateScale(16), borderBottomWidth: 1, borderBottomColor: borderColor }}
                >
                  <Text style={{ fontSize: moderateScale(16), color: selectedDepartment === '' ? primaryColor : textColor, fontWeight: selectedDepartment === '' ? '600' : '400' }}>
                    All Departments
                  </Text>
                  {selectedDepartment === '' && <Check size={moderateScale(20)} color={primaryColor} />}
                </TouchableOpacity>
                {availableDepartments
                  .filter(dep => dep.toLowerCase().includes(departmentSearchQuery.toLowerCase()))
                  .map((dep) => {
                    const isSelected = selectedDepartment === dep;
                    return (
                      <TouchableOpacity
                        key={dep}
                        onPress={() => {
                          setSelectedDepartment(dep);
                          setShowDepartmentModal(false);
                        }}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: moderateScale(16), borderBottomWidth: 1, borderBottomColor: borderColor }}
                      >
                        <Text style={{ fontSize: moderateScale(16), color: isSelected ? primaryColor : textColor, fontWeight: isSelected ? '600' : '400' }}>
                          {dep}
                        </Text>
                        {isSelected && <Check size={moderateScale(20)} color={primaryColor} />}
                      </TouchableOpacity>
                    );
                  })}
              </ScrollView>
            </View>
          </View>
        )}

        {/* Bottom Sheet for Location Selection */}
        {showLocationModal && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end', zIndex: 100 }}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowLocationModal(false)} />
            <View style={{ backgroundColor, borderTopLeftRadius: moderateScale(16), borderTopRightRadius: moderateScale(16), padding: moderateScale(16), maxHeight: '60%' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: moderateScale(16) }}>
                <Text style={{ fontSize: moderateScale(18), fontWeight: '600', color: textColor }}>Select Location</Text>
                <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                  <Text style={{ color: primaryColor, fontWeight: '600', fontSize: moderateScale(16) }}>Done</Text>
                </TouchableOpacity>
              </View>
              <ScrollView>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedLocation('');
                    setShowLocationModal(false);
                  }}
                  style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: moderateScale(16), borderBottomWidth: 1, borderBottomColor: borderColor }}
                >
                  <Text style={{ fontSize: moderateScale(16), color: selectedLocation === '' ? primaryColor : textColor, fontWeight: selectedLocation === '' ? '600' : '400' }}>
                    All Locations
                  </Text>
                  {selectedLocation === '' && <Check size={moderateScale(20)} color={primaryColor} />}
                </TouchableOpacity>
                {locations.map((loc: any) => {
                  const isSelected = selectedLocation === loc._id;
                  return (
                    <TouchableOpacity
                      key={loc._id}
                      onPress={() => {
                        setSelectedLocation(loc._id);
                        setShowLocationModal(false);
                      }}
                      style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: moderateScale(16), borderBottomWidth: 1, borderBottomColor: borderColor }}
                    >
                      <Text style={{ fontSize: moderateScale(16), color: isSelected ? primaryColor : textColor, fontWeight: isSelected ? '600' : '400' }}>
                        {loc.name} {loc.locationType ? `(${loc.locationType})` : ''}
                      </Text>
                      {isSelected && <Check size={moderateScale(20)} color={primaryColor} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}
