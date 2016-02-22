module.exports = function (Interaction) {
  Interaction.validatesInclusionOf('status', { in: ['present', 'finishing'] });
}
