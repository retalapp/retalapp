module.exports = ($module) => {
  const Schema   = $module.adapter.Schema;
  const noteSchema = new Schema({
    id : {
      type: Schema.Types.ObjectId,
      ref: '{ref}'
    },
    ip : String
  })
  return $module.adapter.model('Visitors', noteSchema);
}
