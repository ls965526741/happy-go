import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'

// iconfint
import '@/assets/fonts/iconfont.css'

// axios
import '@/utils/request'

// global.css
import '@/assets/css/global.css'

import './element-ui'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css'

if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
}

Vue.use(VueQuillEditor /* { default global options } */)
