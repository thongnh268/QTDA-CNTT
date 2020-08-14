var XLSX = require('xlsx')
workbook = XLSX.readFile('data/SysData.xlsx'),
SheetNames = workbook.SheetNames
const sysLoaiBaoCao = XLSX.utils.sheet_to_json(workbook.Sheets[SheetNames[0]], {raw: true, dafval: null})
const sysLoaiDonViHanhChinh = XLSX.utils.sheet_to_json(workbook.Sheets[SheetNames[1]], {raw: true, dafval: null})
const sysNhomDonVi = XLSX.utils.sheet_to_json(workbook.Sheets[SheetNames[2]], {raw: true, dafval: null})
const sysCapHanhChinh = XLSX.utils.sheet_to_json(workbook.Sheets[SheetNames[3]], {raw: true, dafval: null})
const sysDataStatus = XLSX.utils.sheet_to_json(workbook.Sheets[SheetNames[4]], {raw: true, dafval: null})
const sysTrangThaiDongMo = XLSX.utils.sheet_to_json(workbook.Sheets[SheetNames[5]], {raw: true, dafval: null})

async function importData(){
    let app = require('../server/server')
    let SysLoaiBaoCao = app.models.SysLoaiBaoCao
    let SysLoaiDonViHanhChinh = app.models.SysLoaiDonViHanhChinh
    let SysNhomDonVi = app.models.SysNhomDonVi
    let SysCapHanhChinh = app.models.SysCapHanhChinh
    let SysDataStatus = app.models.SysDataStatus
    let SysTrangThaiDongMo = app.models.SysTrangThaiDongMo

    await SysLoaiBaoCao.destroyAll()
    await SysLoaiDonViHanhChinh.destroyAll()
    await SysNhomDonVi.destroyAll()
    await SysCapHanhChinh.destroyAll()
    await SysDataStatus.destroyAll()
    await SysTrangThaiDongMo.destroyAll()

    for (let i = 0; i < sysLoaiBaoCao.length; i++){
      await SysLoaiBaoCao.customCreate(sysLoaiBaoCao[i].ma, sysLoaiBaoCao[i].ten, sysLoaiBaoCao[i].ghiChu)
    }

    for (let i = 0; i < sysLoaiDonViHanhChinh.length; i++){
      await SysLoaiDonViHanhChinh.customCreate(sysLoaiDonViHanhChinh[i].ma, sysLoaiDonViHanhChinh[i].ten, sysLoaiDonViHanhChinh[i].ghiChu)
    } 
    
    for (let i = 0; i < sysNhomDonVi.length; i++){
      await SysNhomDonVi.customCreate(sysNhomDonVi[i].ma, sysNhomDonVi[i].ten, sysNhomDonVi[i].ghiChu)
    } 

    for (let i = 0; i < sysCapHanhChinh.length; i++){
      await SysCapHanhChinh.customCreate(sysCapHanhChinh[i].ma, sysCapHanhChinh[i].ten, sysCapHanhChinh[i].ghiChu)
    }

    for (let i = 0; i < sysDataStatus.length; i++){
      await SysDataStatus.customCreate(sysDataStatus[i].ma, sysDataStatus[i].ten, sysDataStatus[i].ghiChu)
    }
    await Promise.all(sysDataStatus.map(async dataStatus => {
      let trangThaiKeTiep = dataStatus.maTrangThaiKeTiep
      trangThaiKeTiep = trangThaiKeTiep.split(",")
      let maTrangThaiKeTiep = []
      for (let i = 0; i < trangThaiKeTiep.length; i++){
        let nextStatus = await SysDataStatus.findOne({where: {ma: trangThaiKeTiep[i]}})
        if (nextStatus){
          maTrangThaiKeTiep.push(nextStatus.ma)
        } else {
          console.log(trangThaiKeTiep[i])
        }
      }
      let status = await SysDataStatus.findOne({where: {ma: dataStatus.ma}})
      let dataStatusi = {
        id: status.id,
        maTrangThaiKeTiep: maTrangThaiKeTiep,
      }
      await SysDataStatus.upsertWithWhere({id: status.id}, dataStatusi)
    }))
    
    for (let i = 0; i < sysTrangThaiDongMo.length; i++){
      await SysTrangThaiDongMo.customCreate(sysTrangThaiDongMo[i].ma, sysTrangThaiDongMo[i].ten, sysTrangThaiDongMo[i].ghiChu)
    }

    console.log('done with', sysLoaiBaoCao.length, sysLoaiDonViHanhChinh.length,
      sysNhomDonVi.length, sysCapHanhChinh.length, sysDataStatus.length, sysTrangThaiDongMo.length)
}

importData()
