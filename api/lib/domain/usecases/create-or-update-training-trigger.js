module.exports = async function createOrUpdateTrainingTrigger({
  trainingId,
  tubes,
  type,
  threshold,
  domainTransaction,
  trainingRepository,
  trainingTriggerRepository,
}) {
  await trainingRepository.get({ trainingId, domainTransaction });
  return trainingTriggerRepository.createOrUpdate({
    trainingId,
    triggerTubesForCreation: tubes,
    type,
    threshold,
    domainTransaction,
  });
};
