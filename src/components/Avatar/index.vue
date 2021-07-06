<template>
  <div>
    <template v-if="avatarType === 'bahause'">
      <svg
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="40"
        height="40"
      >
        <mask id="mask__bauhaus" maskUnits="userSpaceOnUse" x="0" y="0" :width="size" :height="size">
          <rect :width="SIZE" :height="SIZE" :rx="isRect ? 30 : size * 2" fill="white" />
        </mask>

        <g mask="mask__bauhaus">
          <rect :width="SIZE" :height="SIZE" :fill="properties[0].color" />
          <rect
            :x="rectX"
            :y="rectY"
            :width="size"
            :height="height1"
            :fill="properties[1].color"
            :transform="transformation1"
          />
          <circle
            :cx="circleX"
            :cy="circleY"
            :fill="properties[2].color"
            :r="circleR0"
            :transform="transformation2"
          />
          <line
            x1="0"
            :y1="lineY1"
            :x2="SIZE"
            :y2="lineY2"
            strokeWidth="2"
            :stroke="properties[3].color"
            :transform="transformation3"
          />
        </g>
      </svg>
    </template>
    <template v-if="avatarType === 'pixel'">
      <svg :viewBox="pixelViewBox" xmlns="http://www.w3.org/2000/svg">
        <mask id="mask0" mask-type="alpha" x="0" y="0" width="100%" height="100%">
          <!--          <rect width="80" height="80" r="20" fill="white" />-->
          <circle cx="40" cy="40" r="40" fill="white" />

        </mask>
        <g mask="url(#mask0)">
          <rect width="10" height="10" :fill="properties[0].color" />
          <rect x="20" width="10" height="10" :fill="properties[1].color" />
          <rect x="40" width="10" height="10" :fill="properties[2].color" />
          <rect x="60" width="10" height="10" :fill="properties[3].color" />
          <rect x="10" width="10" height="10" :fill="properties[4].color" />
          <rect x="30" width="10" height="10" :fill="properties[5].color" />
          <rect x="50" width="10" height="10" :fill="properties[6].color" />
          <rect x="70" width="10" height="10" :fill="properties[7].color" />
          <rect y="10" width="10" height="10" :fill="properties[8].color" />
          <rect y="20" width="10" height="10" :fill="properties[9].color" />
          <rect y="30" width="10" height="10" :fill="properties[10].color" />
          <rect y="40" width="10" height="10" :fill="properties[11].color" />
          <rect y="50" width="10" height="10" :fill="properties[12].color" />
          <rect y="60" width="10" height="10" :fill="properties[13].color" />
          <rect y="70" width="10" height="10" :fill="properties[14].color" />
          <rect x="20" y="10" width="10" height="10" :fill="properties[15].color" />
          <rect x="20" y="20" width="10" height="10" :fill="properties[16].color" />
          <rect x="20" y="30" width="10" height="10" :fill="properties[17].color" />
          <rect x="20" y="40" width="10" height="10" :fill="properties[18].color" />
          <rect x="20" y="50" width="10" height="10" :fill="properties[19].color" />
          <rect x="20" y="60" width="10" height="10" :fill="properties[20].color" />
          <rect x="20" y="70" width="10" height="10" :fill="properties[21].color" />
          <rect x="40" y="10" width="10" height="10" :fill="properties[22].color" />
          <rect x="40" y="20" width="10" height="10" :fill="properties[23].color" />
          <rect x="40" y="30" width="10" height="10" :fill="properties[24].color" />
          <rect x="40" y="40" width="10" height="10" :fill="properties[25].color" />
          <rect x="40" y="50" width="10" height="10" :fill="properties[26].color" />
          <rect x="40" y="60" width="10" height="10" :fill="properties[27].color" />
          <rect x="40" y="70" width="10" height="10" :fill="properties[28].color" />
          <rect x="60" y="10" width="10" height="10" :fill="properties[29].color" />
          <rect x="60" y="20" width="10" height="10" :fill="properties[30].color" />
          <rect x="60" y="30" width="10" height="10" :fill="properties[31].color" />
          <rect x="60" y="40" width="10" height="10" :fill="properties[32].color" />
          <rect x="60" y="50" width="10" height="10" :fill="properties[33].color" />
          <rect x="60" y="60" width="10" height="10" :fill="properties[34].color" />
          <rect x="60" y="70" width="10" height="10" :fill="properties[35].color" />
          <rect x="10" y="10" width="10" height="10" :fill="properties[36].color" />
          <rect x="10" y="20" width="10" height="10" :fill="properties[37].color" />
          <rect x="10" y="30" width="10" height="10" :fill="properties[38].color" />
          <rect x="10" y="40" width="10" height="10" :fill="properties[39].color" />
          <rect x="10" y="50" width="10" height="10" :fill="properties[40].color" />
          <rect x="10" y="60" width="10" height="10" :fill="properties[41].color" />
          <rect x="10" y="70" width="10" height="10" :fill="properties[42].color" />
          <rect x="30" y="10" width="10" height="10" :fill="properties[43].color" />
          <rect x="30" y="20" width="10" height="10" :fill="properties[44].color" />
          <rect x="30" y="30" width="10" height="10" :fill="properties[45].color" />
          <rect x="30" y="40" width="10" height="10" :fill="properties[46].color" />
          <rect x="30" y="50" width="10" height="10" :fill="properties[47].color" />
          <rect x="30" y="60" width="10" height="10" :fill="properties[48].color" />
          <rect x="30" y="70" width="10" height="10" :fill="properties[49].color" />
          <rect x="50" y="10" width="10" height="10" :fill="properties[50].color" />
          <rect x="50" y="20" width="10" height="10" :fill="properties[51].color" />
          <rect x="50" y="30" width="10" height="10" :fill="properties[52].color" />
          <rect x="50" y="40" width="10" height="10" :fill="properties[53].color" />
          <rect x="50" y="50" width="10" height="10" :fill="properties[54].color" />
          <rect x="50" y="60" width="10" height="10" :fill="properties[55].color" />
          <rect x="50" y="70" width="10" height="10" :fill="properties[56].color" />
          <rect x="70" y="10" width="10" height="10" :fill="properties[57].color" />
          <rect x="70" y="20" width="10" height="10" :fill="properties[58].color" />
          <rect x="70" y="30" width="10" height="10" :fill="properties[59].color" />
          <rect x="70" y="40" width="10" height="10" :fill="properties[60].color" />
          <rect x="70" y="50" width="10" height="10" :fill="properties[61].color" />
          <rect x="70" y="60" width="10" height="10" :fill="properties[62].color" />
          <rect x="70" y="70" width="10" height="10" :fill="properties[63].color" />
        </g></svg>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    name: {
      type: String,
      default: 'John Juma'
    },
    avatarType: {
      type: String,
      default: 'pixel'
    }
  },
  data() {
    return {
      size: 40,
      ELEMENTS: 5,
      isRect: false,
      SIZE: 40,
      ColorProperties: [['#69d2e7', '#a7dbd8', '#e0e4cc', '#f38630', '#fa6900'], ['#fe4365', '#fc9d9a', '#f9cdad', '#c8c8a9', '#83af9b'], ['#ecd078', '#d95b43', '#c02942', '#542437', '#53777a'], ['#556270', '#4ecdc4', '#c7f464', '#ff6b6b', '#c44d58'], ['#774f38', '#e08e79', '#f1d4af', '#ece5ce', '#c5e0dc'], ['#e8ddcb', '#cdb380', '#036564', '#033649', '#031634'], ['#490a3d', '#bd1550', '#e97f02', '#f8ca00', '#8a9b0f'], ['#594f4f', '#547980', '#45ada8', '#9de0ad', '#e5fcc2'], ['#00a0b0', '#6a4a3c', '#cc333f', '#eb6841', '#edc951'], ['#e94e77', '#d68189', '#c6a49a', '#c6e5d9', '#f4ead5'], ['#3fb8af', '#7fc7af', '#dad8a7', '#ff9e9d', '#ff3d7f'], ['#d9ceb2', '#948c75', '#d5ded9', '#7a6a53', '#99b2b7'], ['#ffffff', '#cbe86b', '#f2e9e1', '#1c140d', '#cbe86b'], ['#efffcd', '#dce9be', '#555152', '#2e2633', '#99173c'], ['#343838', '#005f6b', '#008c9e', '#00b4cc', '#00dffc'], ['#413e4a', '#73626e', '#b38184', '#f0b49e', '#f7e4be'], ['#ff4e50', '#fc913a', '#f9d423', '#ede574', '#e1f5c4'], ['#99b898', '#fecea8', '#ff847c', '#e84a5f', '#2a363b'], ['#655643', '#80bca3', '#f6f7bd', '#e6ac27', '#bf4d28'], ['#00a8c6', '#40c0cb', '#f9f2e7', '#aee239', '#8fbe00'], ['#351330', '#424254', '#64908a', '#e8caa4', '#cc2a41'], ['#554236', '#f77825', '#d3ce3d', '#f1efa5', '#60b99a'], ['#5d4157', '#838689', '#a8caba', '#cad7b2', '#ebe3aa'], ['#8c2318', '#5e8c6a', '#88a65e', '#bfb35a', '#f2c45a'], ['#fad089', '#ff9c5b', '#f5634a', '#ed303c', '#3b8183'], ['#ff4242', '#f4fad2', '#d4ee5e', '#e1edb9', '#f0f2eb'], ['#f8b195', '#f67280', '#c06c84', '#6c5b7b', '#355c7d'], ['#d1e751', '#ffffff', '#000000', '#4dbce9', '#26ade4'], ['#1b676b', '#519548', '#88c425', '#bef202', '#eafde6'], ['#5e412f', '#fcebb6', '#78c0a8', '#f07818', '#f0a830'], ['#bcbdac', '#cfbe27', '#f27435', '#f02475', '#3b2d38'], ['#452632', '#91204d', '#e4844a', '#e8bf56', '#e2f7ce'], ['#eee6ab', '#c5bc8e', '#696758', '#45484b', '#36393b'], ['#f0d8a8', '#3d1c00', '#86b8b1', '#f2d694', '#fa2a00'], ['#2a044a', '#0b2e59', '#0d6759', '#7ab317', '#a0c55f'], ['#f04155', '#ff823a', '#f2f26f', '#fff7bd', '#95cfb7'], ['#b9d7d9', '#668284', '#2a2829', '#493736', '#7b3b3b'], ['#bbbb88', '#ccc68d', '#eedd99', '#eec290', '#eeaa88'], ['#b3cc57', '#ecf081', '#ffbe40', '#ef746f', '#ab3e5b'], ['#a3a948', '#edb92e', '#f85931', '#ce1836', '#009989'], ['#300030', '#480048', '#601848', '#c04848', '#f07241'], ['#67917a', '#170409', '#b8af03', '#ccbf82', '#e33258'], ['#aab3ab', '#c4cbb7', '#ebefc9', '#eee0b7', '#e8caaf'], ['#e8d5b7', '#0e2430', '#fc3a51', '#f5b349', '#e8d5b9'], ['#ab526b', '#bca297', '#c5ceae', '#f0e2a4', '#f4ebc3'], ['#607848', '#789048', '#c0d860', '#f0f0d8', '#604848'], ['#b6d8c0', '#c8d9bf', '#dadabd', '#ecdbbc', '#fedcba'], ['#a8e6ce', '#dcedc2', '#ffd3b5', '#ffaaa6', '#ff8c94'], ['#3e4147', '#fffedf', '#dfba69', '#5a2e2e', '#2a2c31'], ['#fc354c', '#29221f', '#13747d', '#0abfbc', '#fcf7c5'], ['#cc0c39', '#e6781e', '#c8cf02', '#f8fcc1', '#1693a7'], ['#1c2130', '#028f76', '#b3e099', '#ffeaad', '#d14334'], ['#a7c5bd', '#e5ddcb', '#eb7b59', '#cf4647', '#524656'], ['#dad6ca', '#1bb0ce', '#4f8699', '#6a5e72', '#563444'], ['#5c323e', '#a82743', '#e15e32', '#c0d23e', '#e5f04c'], ['#edebe6', '#d6e1c7', '#94c7b6', '#403b33', '#d3643b'], ['#fdf1cc', '#c6d6b8', '#987f69', '#e3ad40', '#fcd036'], ['#230f2b', '#f21d41', '#ebebbc', '#bce3c5', '#82b3ae'], ['#b9d3b0', '#81bda4', '#b28774', '#f88f79', '#f6aa93'], ['#3a111c', '#574951', '#83988e', '#bcdea5', '#e6f9bc'], ['#5e3929', '#cd8c52', '#b7d1a3', '#dee8be', '#fcf7d3'], ['#1c0113', '#6b0103', '#a30006', '#c21a01', '#f03c02'], ['#000000', '#9f111b', '#b11623', '#292c37', '#cccccc'], ['#382f32', '#ffeaf2', '#fcd9e5', '#fbc5d8', '#f1396d'], ['#e3dfba', '#c8d6bf', '#93ccc6', '#6cbdb5', '#1a1f1e'], ['#f6f6f6', '#e8e8e8', '#333333', '#990100', '#b90504'], ['#1b325f', '#9cc4e4', '#e9f2f9', '#3a89c9', '#f26c4f'], ['#a1dbb2', '#fee5ad', '#faca66', '#f7a541', '#f45d4c'], ['#c1b398', '#605951', '#fbeec2', '#61a6ab', '#accec0'], ['#5e9fa3', '#dcd1b4', '#fab87f', '#f87e7b', '#b05574'], ['#951f2b', '#f5f4d7', '#e0dfb1', '#a5a36c', '#535233'], ['#8dccad', '#988864', '#fea6a2', '#f9d6ac', '#ffe9af'], ['#2d2d29', '#215a6d', '#3ca2a2', '#92c7a3', '#dfece6'], ['#413d3d', '#040004', '#c8ff00', '#fa023c', '#4b000f'], ['#eff3cd', '#b2d5ba', '#61ada0', '#248f8d', '#605063'], ['#ffefd3', '#fffee4', '#d0ecea', '#9fd6d2', '#8b7a5e'], ['#cfffdd', '#b4dec1', '#5c5863', '#a85163', '#ff1f4c'], ['#9dc9ac', '#fffec7', '#f56218', '#ff9d2e', '#919167'], ['#4e395d', '#827085', '#8ebe94', '#ccfc8e', '#dc5b3e'], ['#a8a7a7', '#cc527a', '#e8175d', '#474747', '#363636'], ['#f8edd1', '#d88a8a', '#474843', '#9d9d93', '#c5cfc6'], ['#046d8b', '#309292', '#2fb8ac', '#93a42a', '#ecbe13'], ['#f38a8a', '#55443d', '#a0cab5', '#cde9ca', '#f1edd0'], ['#a70267', '#f10c49', '#fb6b41', '#f6d86b', '#339194'], ['#ff003c', '#ff8a00', '#fabe28', '#88c100', '#00c176'], ['#ffedbf', '#f7803c', '#f54828', '#2e0d23', '#f8e4c1'], ['#4e4d4a', '#353432', '#94ba65', '#2790b0', '#2b4e72'], ['#0ca5b0', '#4e3f30', '#fefeeb', '#f8f4e4', '#a5b3aa'], ['#4d3b3b', '#de6262', '#ffb88c', '#ffd0b3', '#f5e0d3'], ['#fffbb7', '#a6f6af', '#66b6ab', '#5b7c8d', '#4f2958'], ['#edf6ee', '#d1c089', '#b3204d', '#412e28', '#151101'], ['#9d7e79', '#ccac95', '#9a947c', '#748b83', '#5b756c'], ['#fcfef5', '#e9ffe1', '#cdcfb7', '#d6e6c3', '#fafbe3'], ['#9cddc8', '#bfd8ad', '#ddd9ab', '#f7af63', '#633d2e'], ['#30261c', '#403831', '#36544f', '#1f5f61', '#0b8185'], ['#aaff00', '#ffaa00', '#ff00aa', '#aa00ff', '#00aaff'], ['#d1313d', '#e5625c', '#f9bf76', '#8eb2c5', '#615375'], ['#ffe181', '#eee9e5', '#fad3b2', '#ffba7f', '#ff9c97'], ['#73c8a9', '#dee1b6', '#e1b866', '#bd5532', '#373b44'], ['#805841', '#dcf7f3', '#fffcdd', '#ffd8d8', '#f5a2a2']]

    }
  },
  computed: {
    rectX() {
      return (this.size - 60) / 2
    },
    rectY() {
      return (this.SIZE - 20) / 2
    },
    height1() {
      return this.properties[1].isSquare ? this.SIZE : this.SIZE / 8
    },
    transformation1() {
      return 'translate(' + this.properties[1].translateX + ' ' + this.properties[1].translateY + ') rotate(' + this.properties[1].rotate + ' ' + this.SIZE / 2 + ' ' + this.SIZE / 2 + ')'
    },
    circleX() {
      return this.SIZE / 2
    },
    circleY() {
      return this.SIZE / 2
    },
    circleR0() {
      return this.SIZE / 4
    },
    transformation2() {
      return 'translate(' + this.properties[2].translateX + ' ' + this.properties[2].translateY + ')'
    },
    lineY1() {
      return this.SIZE / 2
    },
    lineY2() {
      return this.SIZE / 2
    },
    transformation3() {
      return 'translate(' + this.properties[4].translateX + ' ' + this.properties[4].translateY + ') rotate(' + this.properties[3].rotate + ' ' + this.SIZE / 2 + ' ' + this.SIZE / 2 + ')'
    },
    pixelViewBox() {
      return `0 0 ${this.SIZE} ${this.SIZE}`
    }
    // faceTransform() {
    //   return 'translate(' + data.faceTranslateX + ' ' + data.faceTranslateY + ') rotate(' + data.faceRotate + ' ' + SIZE / 2 + ' ' + SIZE / 2 + ')'
    // }
  },
  created() {
    if (this.avatarType === 'pixel') {
      this.ELEMENTS = 64
      this.SIZE = 80
      const randomColorGroup = this.ColorProperties[~~(this.name.charCodeAt(0) / 2)]
      this.properties = this.generateColors(this.name, randomColorGroup)
    } else {
      const randomColorGroup = this.ColorProperties[~~(this.name.charCodeAt(0) / 2)]
      this.properties = this.generateColors2(this.name, randomColorGroup)
    }
  },
  methods: {

    generateColors(name, colors) {
      const numFromName = this.getNumber(name)
      const range = colors && colors.length

      const elementsProperties = Array.from({ length: this.ELEMENTS }, (_, i) => ({
        color: this.getRandomColor(numFromName % (i + 13), colors, range)
      }))

      return elementsProperties
    },
    generateColors2(name, colors) {
      const numFromName = this.getNumber(name)
      const range = colors && colors.length
      const elementsProperties = Array.from({ length: this.ELEMENTS }, (_, i) => ({
        color: this.getRandomColor(numFromName + i, colors, range),
        translateX: this.getUnit(numFromName * (i + 1), this.SIZE / 2 - (i + 17), 1),
        translateY: this.getUnit(numFromName * (i + 1), this.SIZE / 2 - (i + 17), 2),
        rotate: this.getUnit(numFromName * (i + 1), 360),
        isSquare: this.getBoolean(numFromName, 2)
      }))
      return elementsProperties
    },

    // generateData(name, colors) {
    //   const numFromName = this.getNumber(name)
    //   const range = colors && colors.length
    //   const wrapperColor = this.getRandomColor(numFromName, colors, range)
    //   const preTranslateX = this.getUnit(numFromName, 10, 1)
    //   const wrapperTranslateX = preTranslateX < 5 ? preTranslateX + this.SIZE / 9 : preTranslateX
    //   const preTranslateY = this.getUnit(numFromName, 10, 2)
    //   const wrapperTranslateY = preTranslateY < 5 ? preTranslateY + this.SIZE / 9 : preTranslateY
    //
    //   const data = {
    //     wrapperColor: wrapperColor,
    //     faceColor: this.getContrast(wrapperColor),
    //     backgroundColor: this.getRandomColor(numFromName + 13, colors, range),
    //     wrapperTranslateX: wrapperTranslateX,
    //     wrapperTranslateY: wrapperTranslateY,
    //     wrapperRotate: this.getUnit(numFromName, 360),
    //     wrapperScale: 1 + this.getUnit(numFromName, this.SIZE / 12) / 10,
    //     isMouthOpen: this.getBoolean(numFromName, 2),
    //     isCircle: this.getBoolean(numFromName, 1),
    //     eyeSpread: this.getUnit(numFromName, 5),
    //     mouthSpread: this.getUnit(numFromName, 3),
    //     faceRotate: this.getUnit(numFromName, 10, 3),
    //     faceTranslateX:
    //         wrapperTranslateX > this.SIZE / 6 ? wrapperTranslateX / 2 : this.getUnit(numFromName, 8, 1),
    //     faceTranslateY:
    //         wrapperTranslateY > this.SIZE / 6 ? wrapperTranslateY / 2 : this.getUnit(numFromName, 7, 2)
    //   }
    //
    //   return data
    // },
    getRandomColor(number, colors, range) {
      return colors[(number) % range]
    },
    getNumber(name) {
      const charactersArray = Array.from(name)
      let charactersCodesSum = 0

      charactersArray.forEach((charactersArrayItem) => {
        // eslint-disable-next-line no-return-assign
        return charactersCodesSum += charactersArrayItem.charCodeAt(0)
      })

      return charactersCodesSum
    },
    getBoolean(number, ntn) {
      return (!((this.getDigit(number, ntn)) % 2))
    },
    getDigit(number, ntn) {
      return Math.floor((number / Math.pow(10, ntn)) % 10)
    },
    getUnit(number, range, index) {
      if (range === 0) {
        range = Math.random() * 100
      }
      const value = number % range
      if (index && ((this.getDigit(number, index) % 2) === 0)) {
        return -value
      } else return value
    }

  }

}
</script>

<style scoped>

</style>
