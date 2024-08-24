require('@parcel/babel-register/index.js')

const { Parcel } = /** @type {import('@parcel/core')} */ require('@parcel/core/src/index.js')
const { NodeFS } = /** @type {import('@parcel/fs')} */ require('@parcel/fs/src/index.js')

void async function main(){
  const startTime = Date.now()

  const parcel = new Parcel({
    shouldDisableCache: true,
    entries: ["./src2/a.js"],
    inputFS: new NodeFS(),
    featureFlags: {
      parcelV3: true
    }
  })

  const report = await parcel.run()

  console.log(report)
  console.log(Date.now() - startTime)
}()

