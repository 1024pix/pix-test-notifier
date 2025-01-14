// the following list of imports has been generated by the commented code
// const fs = require('fs');
// const path = require('path');
//
// fs.readdir(__dirname, { withFileTypes: true }, (err, dirents) => {
//   dirents.forEach((dirent) => {
//     if (!dirent.isFile() || dirent.name === 'index.js') return;
//     const filePath = dirent.name;
//     const fileName = path.basename(dirent.name, '.js');
//     console.log(`const ${fileName} = require('./${filePath}');`);
//   });
//
//   console.log(`module.exports = {`);
//   dirents.forEach((dirent) => {
//     if (!dirent.isFile() || dirent.name === 'index.js') return;
//     const fileName = path.basename(dirent.name, '.js');
//     console.log(`${fileName},`);
//   });
//   console.log(`}`);
// });
const AccountRecoveryDemand = require('./AccountRecoveryDemand.js');
const AdminMember = require('./AdminMember.js');
const Answer = require('./Answer.js');
const AnswerCollectionForScoring = require('./AnswerCollectionForScoring.js');
const AnswerStatus = require('./AnswerStatus.js');
const Area = require('./Area.js');
const Assessment = require('./Assessment.js');
const AssessmentResult = require('./AssessmentResult.js');
const Authentication = require('./Authentication.js');
const AuthenticationMethod = require('./AuthenticationMethod.js');
const AuthenticationSessionContent = require('./AuthenticationSessionContent.js');
const Badge = require('./Badge.js');
const BadgeAcquisition = require('./BadgeAcquisition.js');
const BadgeCriterion = require('./BadgeCriterion.js');
const BadgeDetails = require('./BadgeDetails.js');
const BadgeForCalculation = require('./BadgeForCalculation.js');
const Campaign = require('./Campaign.js');
const CampaignCreator = require('./CampaignCreator.js');
const CampaignForArchiving = require('./CampaignForArchiving.js');
const CampaignForCreation = require('./CampaignForCreation.js');
const CampaignLearningContent = require('./CampaignLearningContent.js');
const CampaignParticipant = require('./CampaignParticipant.js');
const CampaignParticipation = require('./CampaignParticipation.js');
const CampaignParticipationBadge = require('./CampaignParticipationBadge.js');
const CampaignParticipationResult = require('./CampaignParticipationResult.js');
const CampaignParticipationStatuses = require('./CampaignParticipationStatuses.js');
const CampaignToStartParticipation = require('./CampaignToStartParticipation.js');
const CampaignTypes = require('./CampaignTypes.js');
const CertifiableBadgeAcquisition = require('./CertifiableBadgeAcquisition.js');
const CertifiableProfileForLearningContent = require('./CertifiableProfileForLearningContent.js');
const CertificationAnswerStatusChangeAttempt = require('./CertificationAnswerStatusChangeAttempt.js');
const CertificationAssessment = require('./CertificationAssessment.js');
const CertificationAssessmentScore = require('./CertificationAssessmentScore.js');
const CertificationAttestation = require('./CertificationAttestation.js');
const CertificationCandidate = require('./CertificationCandidate.js');
const CertificationCandidateForSupervising = require('./CertificationCandidateForSupervising.js');
const CertificationCenter = require('./CertificationCenter.js');
const CertificationCenterForAdmin = require('./CertificationCenterForAdmin.js');
const CertificationCenterInvitation = require('./CertificationCenterInvitation.js');
const CertificationCenterInvitedUser = require('./CertificationCenterInvitedUser.js');
const CertificationCenterMembership = require('./CertificationCenterMembership.js');
const CertificationChallenge = require('./CertificationChallenge.js');
const CertificationChallengeWithType = require('./CertificationChallengeWithType.js');
const CertificationContract = require('./CertificationContract.js');
const CertificationCourse = require('./CertificationCourse.js');
const CertificationCpfCity = require('./CertificationCpfCity.js');
const CertificationCpfCountry = require('./CertificationCpfCountry.js');
const CertificationIssueReport = require('./CertificationIssueReport.js');
const CertificationIssueReportCategory = require('./CertificationIssueReportCategory.js');
const CertificationIssueReportResolutionAttempt = require('./CertificationIssueReportResolutionAttempt.js');
const CertificationIssueReportResolutionStrategies = require('./CertificationIssueReportResolutionStrategies.js');
const CertificationOfficer = require('./CertificationOfficer.js');
const CertificationReport = require('./CertificationReport.js');
const CertificationResult = require('./CertificationResult.js');
const CertifiedLevel = require('./CertifiedLevel.js');
const CertifiedScore = require('./CertifiedScore.js');
const Challenge = require('./Challenge.js');
const Competence = require('./Competence.js');
const CompetenceEvaluation = require('./CompetenceEvaluation.js');
const CompetenceMark = require('./CompetenceMark.js');
const CompetenceResult = require('./CompetenceResult.js');
const CompetenceTree = require('./CompetenceTree.js');
const ComplementaryCertification = require('./ComplementaryCertification.js');
const ComplementaryCertificationCourse = require('./ComplementaryCertificationCourse.js');
const ComplementaryCertificationCourseResult = require('./ComplementaryCertificationCourseResult.js');
const ComplementaryCertificationHabilitation = require('./ComplementaryCertificationHabilitation.js');
const ComplementaryCertificationScoringCriteria = require('./ComplementaryCertificationScoringCriteria.js');
const ComplementaryCertificationScoringWithComplementaryReferential = require('./ComplementaryCertificationScoringWithComplementaryReferential.js');
const ComplementaryCertificationScoringWithoutComplementaryReferential = require('./ComplementaryCertificationScoringWithoutComplementaryReferential.js');
const Correction = require('./Correction.js');
const Course = require('./Course.js');
const DataProtectionOfficer = require('./DataProtectionOfficer.js');
const Division = require('./Division.js');
const EmailModificationDemand = require('./EmailModificationDemand.js');
const EmailingAttempt = require('./EmailingAttempt.js');
const Examiner = require('./Examiner.js');
const FinalizedSession = require('./FinalizedSession.js');
const Framework = require('./Framework.js');
const Group = require('./Group.js');
const Hint = require('./Hint.js');
const JuryCertification = require('./JuryCertification.js');
const JurySession = require('./JurySession.js');
const KnowledgeElement = require('./KnowledgeElement.js');
const LearningContent = require('./LearningContent.js');
const Membership = require('./Membership.js');
const NeutralizationAttempt = require('./NeutralizationAttempt.js');
const Organization = require('./Organization.js');
const OrganizationForAdmin = require('./organizations-administration/Organization.js');
const OrganizationInvitation = require('./OrganizationInvitation.js');
const OrganizationInvitedUser = require('./OrganizationInvitedUser.js');
const OrganizationLearner = require('./OrganizationLearner.js');
const OrganizationMemberIdentity = require('./OrganizationMemberIdentity.js');
const OrganizationPlacesLot = require('./OrganizationPlacesLot.js');
const OrganizationTag = require('./OrganizationTag.js');
const OrganizationsToAttachToTargetProfile = require('./OrganizationsToAttachToTargetProfile.js');
const ParticipantResultsShared = require('./ParticipantResultsShared.js');
const ParticipationForCampaignManagement = require('./ParticipationForCampaignManagement.js');
const PartnerCertificationScoring = require('./PartnerCertificationScoring.js');
const PlacementProfile = require('./PlacementProfile.js');
const PoleEmploiSending = require('./PoleEmploiSending.js');
const PrivateCertificate = require('./PrivateCertificate.js');
const Progression = require('./Progression.js');
const ReproducibilityRate = require('./ReproducibilityRate.js');
const ResultCompetence = require('./ResultCompetence.js');
const ResultCompetenceTree = require('./ResultCompetenceTree.js');
const SCOCertificationCandidate = require('./SCOCertificationCandidate.js');
const Scorecard = require('./Scorecard.js');
const ScoringSimulation = require('./ScoringSimulation.js');
const ScoringSimulationContext = require('./ScoringSimulationContext.js');
const ScoringSimulationDataset = require('./ScoringSimulationDataset.js');
const ScoringSimulationResult = require('./ScoringSimulationResult.js');
const Session = require('./Session.js');
const SessionJuryComment = require('./SessionJuryComment.js');
const SessionPublicationBatchResult = require('./SessionPublicationBatchResult.js');
const ShareableCertificate = require('./ShareableCertificate.js');
const Skill = require('./Skill.js');
const SkillSet = require('./SkillSet.js');
const Solution = require('./Solution.js');
const Stage = require('./Stage.js');
const Student = require('./Student.js');
const SupOrganizationLearner = require('./SupOrganizationLearner.js');
const SupOrganizationLearnerSet = require('./SupOrganizationLearnerSet.js');
const Tag = require('./Tag.js');
const TargetProfile = require('./TargetProfile.js');
const TargetProfileForAdmin = require('./TargetProfileForAdmin.js');
const TargetProfileForCreation = require('./TargetProfileForCreation.js');
const TargetProfileSummaryForAdmin = require('./TargetProfileSummaryForAdmin.js');
const Thematic = require('./Thematic.js');
const Training = require('./Training.js');
const TrainingTrigger = require('./TrainingTrigger.js');
const TrainingTriggerTube = require('./TrainingTriggerTube.js');
const Tube = require('./Tube.js');
const Tutorial = require('./Tutorial.js');
const TutorialEvaluation = require('./TutorialEvaluation.js');
const User = require('./User.js');
const UserCompetence = require('./UserCompetence.js');
const UserDetailsForAdmin = require('./UserDetailsForAdmin.js');
const UserLogin = require('./UserLogin.js');
const UserOrgaSettings = require('./UserOrgaSettings.js');
const UserSavedTutorial = require('./UserSavedTutorial.js');
const UserSavedTutorialWithTutorial = require('./UserSavedTutorialWithTutorial.js');
const UserToCreate = require('./UserToCreate.js');
const Validation = require('./Validation.js');
const Validator = require('./Validator.js');
const ValidatorAlwaysOK = require('./ValidatorAlwaysOK.js');
const ValidatorQCM = require('./ValidatorQCM.js');
const ValidatorQCU = require('./ValidatorQCU.js');
const ValidatorQROC = require('./ValidatorQROC.js');
const ValidatorQROCMDep = require('./ValidatorQROCMDep.js');
const ValidatorQROCMInd = require('./ValidatorQROCMInd.js');
module.exports = {
  AccountRecoveryDemand,
  AdminMember,
  Answer,
  AnswerCollectionForScoring,
  AnswerStatus,
  Area,
  Assessment,
  AssessmentResult,
  Authentication,
  AuthenticationMethod,
  AuthenticationSessionContent,
  Badge,
  BadgeAcquisition,
  BadgeCriterion,
  BadgeDetails,
  BadgeForCalculation,
  Campaign,
  CampaignCreator,
  CampaignForArchiving,
  CampaignForCreation,
  CampaignLearningContent,
  CampaignParticipant,
  CampaignParticipation,
  CampaignParticipationBadge,
  CampaignParticipationResult,
  CampaignParticipationStatuses,
  CampaignToStartParticipation,
  CampaignTypes,
  CertifiableBadgeAcquisition,
  CertifiableProfileForLearningContent,
  CertificationAnswerStatusChangeAttempt,
  CertificationAssessment,
  CertificationAssessmentScore,
  CertificationAttestation,
  CertificationCandidate,
  CertificationCandidateForSupervising,
  CertificationCenter,
  CertificationCenterForAdmin,
  CertificationCenterInvitation,
  CertificationCenterInvitedUser,
  CertificationCenterMembership,
  CertificationChallenge,
  CertificationChallengeWithType,
  CertificationContract,
  CertificationCourse,
  CertificationCpfCity,
  CertificationCpfCountry,
  CertificationIssueReport,
  CertificationIssueReportCategory,
  CertificationIssueReportResolutionAttempt,
  CertificationIssueReportResolutionStrategies,
  CertificationOfficer,
  CertificationReport,
  CertificationResult,
  CertifiedLevel,
  CertifiedScore,
  Challenge,
  Competence,
  CompetenceEvaluation,
  CompetenceMark,
  CompetenceResult,
  CompetenceTree,
  ComplementaryCertification,
  ComplementaryCertificationCourse,
  ComplementaryCertificationCourseResult,
  ComplementaryCertificationHabilitation,
  ComplementaryCertificationScoringCriteria,
  ComplementaryCertificationScoringWithComplementaryReferential,
  ComplementaryCertificationScoringWithoutComplementaryReferential,
  Correction,
  Course,
  DataProtectionOfficer,
  Division,
  EmailModificationDemand,
  EmailingAttempt,
  Examiner,
  FinalizedSession,
  Framework,
  Group,
  Hint,
  JuryCertification,
  JurySession,
  KnowledgeElement,
  LearningContent,
  Membership,
  NeutralizationAttempt,
  Organization,
  OrganizationForAdmin,
  OrganizationInvitation,
  OrganizationInvitedUser,
  OrganizationLearner,
  OrganizationMemberIdentity,
  OrganizationPlacesLot,
  OrganizationTag,
  OrganizationsToAttachToTargetProfile,
  ParticipantResultsShared,
  ParticipationForCampaignManagement,
  PartnerCertificationScoring,
  PlacementProfile,
  PoleEmploiSending,
  PrivateCertificate,
  Progression,
  ReproducibilityRate,
  ResultCompetence,
  ResultCompetenceTree,
  SCOCertificationCandidate,
  Scorecard,
  ScoringSimulation,
  ScoringSimulationContext,
  ScoringSimulationDataset,
  ScoringSimulationResult,
  Session,
  SessionJuryComment,
  SessionPublicationBatchResult,
  ShareableCertificate,
  Skill,
  SkillSet,
  Solution,
  Stage,
  Student,
  SupOrganizationLearner,
  SupOrganizationLearnerSet,
  Tag,
  TargetProfile,
  TargetProfileForAdmin,
  TargetProfileForCreation,
  TargetProfileSummaryForAdmin,
  Thematic,
  Training,
  TrainingTrigger,
  TrainingTriggerTube,
  Tube,
  Tutorial,
  TutorialEvaluation,
  User,
  UserCompetence,
  UserDetailsForAdmin,
  UserLogin,
  UserOrgaSettings,
  UserSavedTutorial,
  UserSavedTutorialWithTutorial,
  UserToCreate,
  Validation,
  Validator,
  ValidatorAlwaysOK,
  ValidatorQCM,
  ValidatorQCU,
  ValidatorQROC,
  ValidatorQROCMDep,
  ValidatorQROCMInd,
};
