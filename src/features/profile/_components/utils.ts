export const getProfileDisplayData = (userData: any) => {
    const fullName = userData ? `${userData.firstname || ''} ${userData.lastname || ''}`.trim() : 'Loading...';
    const displayName = fullName || userData?.name || userData?.email || 'Unknown User';
    const userRole = userData?.role || userData?.designation || 'Staff Member';
    const userId = userData?.staffId || userData?._id?.substring(0, 8) || userData?.id?.substring(0, 8) || '----';
    const facilityName = userData?.facilityDetail?.facilityName || 'Unknown Facility';
    const imageURL = userData?.imageurl;
    const facilityStatus = userData?.facilityDetail?.active;

    let facilityBranch = 'Unknown Branch';
    if (userData?.facilityDetail?.facilityLGA) {
        facilityBranch = `${userData.facilityDetail.facilityLGA}, ${userData?.facilityDetail?.facilityState || ''}`;
    } else if (userData?.facilityDetail?.facilityState) {
        facilityBranch = userData.facilityDetail.facilityState;
    }

    return {
        fullName,
        displayName,
        userRole,
        userId,
        facilityName,
        imageURL,
        facilityStatus,
        facilityBranch
    };
};
