var XLSX = require('xlsx')
workbook = XLSX.readFile('data/tinhhuyenxa.xlsx'),
SheetNames = workbook.SheetNames
const huyen = XLSX.utils.sheet_to_json(workbook.Sheets[SheetNames[0]], {raw: true, dafval: null})
const xa = XLSX.utils.sheet_to_json(workbook.Sheets[SheetNames[1]], {raw: true, dafval: null})
const tinh = XLSX.utils.sheet_to_json(workbook.Sheets[SheetNames[2]], {raw: true, dafval: null})

async function importData(){
    let app = require('../server/server')
    let SysLoaiDonViHanhChinh = app.models.SysLoaiDonViHanhChinh
    let SysCapHanhChinh = app.models.SysCapHanhChinh
    let QCTinh = app.models.QCTinh
    let QCHuyen = app.models.QCHuyen
    let QCXa = app.models.QCXa

    await QCTinh.destroyAll()
    await QCHuyen.destroyAll()
    await QCXa.destroyAll()

    let capTinh = await SysCapHanhChinh.findOne({where: {ten: "Tỉnh"}})
    let capHuyen = await SysCapHanhChinh.findOne({where: {ten: "Huyện"}})
    let capXa = await SysCapHanhChinh.findOne({where: {ten: "Xã"}})
    let loaiDVHC = await SysLoaiDonViHanhChinh.findOne({where: {ma: "SLDVHC01"}})

    for (let i = 0; i < tinh.length; i++){
      let tinhData =  tinh[i]
      await QCTinh.customCreate(tinhData.ma, tinhData.ten, capTinh.id, loaiDVHC.id)
    }

    for (let i = 0; i < huyen.length; i++){
      let huyenData =  huyen[i]
      let tinh = await QCTinh.findOne({where: {ma: huyenData.maTinh}})
      await QCHuyen.customCreate(huyenData.ma, huyenData.ten, tinh.id, capHuyen.id, loaiDVHC.id)
    }

    for (let i = 0; i < xa.length; i++){
      let xaData =  xa[i]
      let huyen = await QCHuyen.findOne({where: {ma: xaData.maHuyen}})
      await QCXa.customCreate(xaData.ma, xaData.ten, huyen.id, capXa.id, loaiDVHC.id)
    }
    
    console.log('done with', tinh.length, huyen.length, xa.length)
}

importData()
