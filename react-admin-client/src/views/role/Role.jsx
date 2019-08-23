import React, { Component } from 'react'
import{
  Table,
  Button,
  Card,
  Modal,
  message
} from 'antd'
import AddForm from './add-form'
import AuthForm from './auth-form'
import { getRoles, addRole } from '../../api/index'
import {PAGE_SIZE} from '../../utils/constance'
export default class Role extends Component {
  state = {
    roles: [], // 所有角色列表
    role: {}, // 选中的role
    visible: false, // modal 对话框是否可见（添加角色）
    authVisible: false // modal 对话框是否可见（角色授权）
  }
  
  initColumns = () => {
    this.columns = [
      {
        dataIndex: 'name',
        title: '角色名称'
      },
      {
        dataIndex: 'create_time',
        title: '创建时间'
      },
      {
        dataIndex: 'auth_time',
        title: '授权时间'
      },
      {
        dataIndex: 'auth_name',
        title: '授权人'
      },
    ]
  }

  /*
    获取角色列表
  */

  getRoles = async () => {
    const ret = await getRoles()
    if (ret.status === 0) {
      const roles = ret.data
      this.setState({roles})
    }
  }

  /*
    表格行属性onRow
  */
  onRow = role => {
    return {
      onClick: event => {
        // 表格行点击时的回调
        this.setState({role})
      }
    }
  }

  /*
    添加角色
  */
  handleAddRole = () => {
    // 对表单进行统一规则验证
    this.form.validateFields(async (error, values) => {
      if (!error) {
        // 验证通过
        const {roleName} = values
        const ret = await addRole(roleName)
        if (ret.status === 0) {
          message.success('添加角色成功！')
          this.getRoles()
          this.form.resetFields()
          this.setState({visible: false})
        } else {
          message.error('添加角色失败！')
        }
      } else {
        console.log(error)
      }
    })
  }

  componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getRoles()
  }
  render() {
    const {roles, role, visible, authVisible} = this.state
    const title = (<span><Button type='primary' style={{marginRight: 15}} onClick={() => this.setState({visible: true})}>创建角色</Button><Button type='primary' disabled={!role._id} onClick={() => this.setState({authVisible: true})}>设置角色权限</Button></span>)
    return (
      <Card title={title}>
        <Table
          dataSource={roles}
          columns={this.columns} 
          rowKey='_id'
          bordered
          pagination={{defaultPageSize: PAGE_SIZE, showQuickJumper: true}}
          rowSelection={{type: 'radio', selectedRowKeys: [role._id],
            // 点击radio的回调，解决单独点击radio选不中的Bug
            onSelect: role => this.setState({role})}
          }
          onRow={this.onRow}
        />
        <Modal
          title="添加角色"
          visible={visible}
          onOk={this.handleAddRole}
          onCancel={() => {
            this.setState({visible: false})
            this.form.resetFields()
          }}
          okText="确认"
          cancelText="取消"
        >
          <AddForm getForm={(from) => this.form = from}></AddForm>
        </Modal>
        <Modal
          title='设置角色权限'
          visible={authVisible}
          onOk={this.handleAuthRole}
          onCancel={() => console.log(23123)}
          okText='确认'
          cancelText='取消'
        >
          <AuthForm/>
        </Modal>
      </Card>
    )
  }
}
