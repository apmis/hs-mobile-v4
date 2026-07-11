import { ScaledSheet } from 'react-native-size-matters';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from '@/app/shared/constants/Theme';
import { Spacing } from '@/app/shared/constants/Theme';

export const styles = ScaledSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    zIndex: 10,
  },
  backButton: {
    marginRight: Spacing.sm,
  },
  iconButtonLeft: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.sm,
  },
  headerAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  headerTitleContainer: {
    flex: 1,
    paddingLeft: moderateScale(8),
  },
  headerTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#0059B2',
  },
  onlineText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#10B981',
    marginTop: moderateScale(2),
  },
  iconButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: Spacing.md,
    paddingBottom: moderateScale(80),
  },
  sessionPillContainer: {
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },
  sessionPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(16),
  },
  sessionPillText: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  dateSeparator: {
    alignSelf: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(16),
    marginBottom: moderateScale(20),
  },
  dateText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },

  // Group Header specifics
  groupAvatarCluster: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clusterImg: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    borderWidth: 2,
    borderColor: Colors.white,
  },
  clusterBadge: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: '#0059B2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clusterBadgeText: {
    color: Colors.white,
    fontSize: moderateScale(12),
    fontWeight: '700',
  },
  headerSubtitleGroup: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: '#6B7280',
    marginTop: moderateScale(2),
    letterSpacing: 0.5,
  },

  // Group Chat Layout
  pinnedCaseCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(16),
    marginBottom: moderateScale(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  pinnedBlueAccent: {
    width: moderateScale(6),
    backgroundColor: '#0059B2',
  },
  pinnedContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(14),
  },
  pinnedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pinnedIconBox: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(10),
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  folderIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    resizeMode: 'contain',
  },
  pinnedTextCol: {
    flex: 1,
  },
  pinnedTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: moderateScale(2),
  },
  pinnedSub: {
    fontSize: moderateScale(12),
    color: '#6B7280',
    fontWeight: '500',
  },
  viewCaseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0059B2',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(16),
    marginLeft: moderateScale(8),
  },
  viewCaseBtnText: {
    color: Colors.white,
    fontSize: moderateScale(12),
    fontWeight: '600',
  },

  // System alert
  systemAlertContainer: {
    alignItems: 'center',
    marginVertical: moderateScale(16),
  },
  systemAlertBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(16),
  },
  systemAlertText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#065F46',
    marginLeft: moderateScale(8),
  },
  inputContainer: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: Spacing.md,
    paddingTop: moderateScale(10),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: moderateScale(30),
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(6),
  },
  attachButton: {
    padding: moderateScale(10),
  },
  textInput: {
    flex: 1,
    minHeight: moderateScale(40),
    fontSize: moderateScale(15),
    color: '#1F2937',
    paddingHorizontal: moderateScale(4),
  },
  smileButton: {
    padding: moderateScale(10),
  },
  sendButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#0059B2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: moderateScale(4),
  },
});