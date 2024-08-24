const { Parcel } = /** @type {import('@parcel/core')} */ require('@parcel/core/lib/index.js')
const { NodeFS } = /** @type {import('@parcel/fs')} */ require('@parcel/fs/lib/index.js')

void async function main(){
  const startTime = Date.now()

  const parcel = new Parcel({
    shouldDisableCache: true,
    entries: ["./src/index_50.js"],
    // entries: ["./src/index_50.js"],
    // entries: ["./src/copy_1/Three.js"],
    // entries: ["./src2/a.js"],
    inputFS: new NodeFS(),
    nodeWorkers: 0,
    featureFlags: {
      parcelV3: false
    }
  })

  const report = await parcel.run()

  // console.log(report)
  console.log(Date.now() - startTime)
}()