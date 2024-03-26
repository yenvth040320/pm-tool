/*
 * Copyright 2020 Digi Dinos JSC. All rights reserved.
 * Email: tech@digidinos.com.
 */

import Vue from 'vue'

import {
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  ConfigProvider,
  DatePicker,
  Divider,
  Drawer,
  Dropdown,
  Form,
  FormModel,
  Icon,
  Input,
  InputNumber,
  Layout,
  Menu,
  message,
  Modal,
  notification,
  PageHeader,
  Popover,
  Progress,
  Radio,
  Result,
  Row,
  Select,
  Spin,
  Statistic,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Tree,
  TreeSelect,
  Upload,
  Empty,
  Steps
} from 'ant-design-vue'

Vue.use(Badge)
Vue.use(Button)
Vue.use(Card)
Vue.use(Checkbox)
Vue.use(Col)
Vue.use(Collapse)
Vue.use(ConfigProvider)
Vue.use(DatePicker)
Vue.use(Divider)
Vue.use(Drawer)
Vue.use(Dropdown)
Vue.use(Form)
Vue.use(FormModel)
Vue.use(Icon)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Layout)
Vue.use(Menu)
Vue.use(Modal)
Vue.use(PageHeader)
Vue.use(Popover)
Vue.use(Progress)
Vue.use(Radio)
Vue.use(Result)
Vue.use(Row)
Vue.use(Select)
Vue.use(Spin)
Vue.use(Statistic)
Vue.use(Switch)
Vue.use(Table)
Vue.use(Tabs)
Vue.use(Tag)
Vue.use(Tooltip)
Vue.use(Tree)
Vue.use(TreeSelect)
Vue.use(Upload)
Vue.use(Empty)
Vue.use(Steps)

Vue.prototype.$notification = notification
Vue.prototype.$message = message
Vue.prototype.$confirm = Modal.confirm
