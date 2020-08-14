let app = require('../server/server')
let customCRUD = require('../common/utils/custom-crud')

async function checkData() {
  let models = app.models
  for (let x in models) {
    let model = models[x]
    let records = await model.find()
    for (let y in records) {
      let queryData = records[y]
      let relations = model.definition.settings.relations || new Object()
      let relationsKey = Object.keys(relations)
      for (let i in relationsKey) {
        let item = relationsKey[i]
        if (relations[item].type.match(/^belongsTo/)) {
          let rfModel = app.models[relations[item].model]
          let fk = relations[item].foreignKey
          if (queryData[fk] != undefined) {
            if (Array.isArray(queryData[fk])) {
              for (let j in queryData[fk]) {
                let rfRecord = await rfModel.findById(queryData[fk][j])
                if (!rfRecord) {
                  console.log({"not existed, model": model.name, "id": queryData.id, "refermodel": relations[item].model, "referId":queryData[fk][j]})
                } else if (rfRecord.xoa == true) {
                  console.log({"deleted, model": model.name, "id": queryData.id, "refermodel": relations[item].model, "referId":queryData[fk][j]})
                }
              }
            } else {
              let rfRecord = await rfModel.findById(queryData[fk])
              if (!rfRecord) {
                console.log({"not existed, model": model.name, "id": queryData.id, "refermodel": relations[item].model, "referId":queryData[fk]})
              } else if (rfRecord.xoa == true) {
                console.log({"deleted, model": model.name, "id": queryData.id, "refermodel": relations[item].model, "referId":queryData[fk]})
              }
            }
          }
        }
      }
    }
  }
  console.log(done)
}

checkData()
