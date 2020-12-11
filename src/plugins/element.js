import Vue from 'vue'
import { Button } from 'element-ui'
import { Input } from 'element-ui'
import { Form, FormItem} from 'element-ui'
//导入弹框提示组件
import { Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

//与element-UI的其它组件不同（这里不用vue的use方法）
//把弹框组件挂载到Vue的原型上，这样每个组件都可以用到
Vue.prototype.$message = Message
