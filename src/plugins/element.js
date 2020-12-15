import Vue from 'vue'
import { 
    Button, 
    Input, 
    Form, 
    FormItem, 
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox 
} from 'element-ui'
// import { Input } from 'element-ui'
// import { Form, FormItem} from 'element-ui'
// //导入弹框提示组件
// import { Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)

//与element-UI的其它组件不同（这里不用vue的use方法）
//把弹框组件挂载到Vue的原型上，这样每个组件都可以用到
Vue.prototype.$message = Message

Vue.prototype.$confirm = MessageBox.confirm
