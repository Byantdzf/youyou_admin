<template>
    <div v-model="activeTab">
      <Card>
        <Tabs @on-click="getTab">
          <TabPane :label="item.title"  :name="item.jump" v-for="item,index in tab" :key="index">
            <Col span="24">
              <Input
                v-model="searchKeyword"
                @on-enter="handleSearch"
                placeholder="关键字搜索..."
                style="width: 200px; margin-bottom: 22px;"/>
              <span @click="handleSearch" >
                    <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
                </span>
              <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
              <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                    style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
            </Col>
          </TabPane>
        </Tabs>

      </Card>
        <Modal
                v-model="modal1"
                title="温馨提示"
                @on-ok="ok"
        >
            <p >是否执行该操作？</p>
        </Modal>
        <Modal
                v-model="modal"
                title="编辑公众号"
                @on-ok="cancel"
        >
            <Input v-model="value" placeholder="Enter something..." style="width: 300px"></Input>
        </Modal>
    </div>
</template>

<script>
    import uAxios from '../../api/index';
    import config from '../../api/config';
    import Cookies from 'js-cookie';

    export default {
        search: '',
        name: 'index',
        data () {
            return {
                tab: [{title:'未审核', jump: '0'},{title:'已审核',jump: '1'}],
                activeTab: '0',
                currentPage: 1,
                searchKeyword: '',
                orgTotal: 0,
                fieldList: [],
                modelValue: '',
                industryList: [],
                id: '',
                addressList: [],
                modal1: false,
                cost: '',
                orgColumns: [
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '头像',
                        key: 'avatar',
                        render: (h, params) => {
                            return h('img', {
                                attrs: {
                                    src: params.row.avatar
                                },
                                style:{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    marginTop: '6px',
                                    border: '4px solid #f4f4f4'
                                },
                                on: {
                                    click: () => {
                                        let argu = {id: params.row.id};
                                        this.$router.push({
                                            name: 'user_detail',
                                            params: argu
                                        });
                                    }
                                }
                            });
                        },
                        align: 'center'
                    },
                    {
                        title: '客户数',
                        key: 'client_count',
                        align: 'center',
                        editable: true
                    },
                    {
                        title: '备注数',
                        key: 'comment_count',
                        align: 'center',
                        editable: true
                    },
                    {
                        title: '认证数',
                        key: 'good_match_count',
                        align: 'center',
                        editable: true
                    },
                    {
                        title: '服务数',
                        key: 'service_count',
                        align: 'center',
                        editable: true
                    },
                    {
                        title: '服务金额',
                        key: 'service_sum',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            if(this.activeTab == '0'){
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'success'
                                        },
                                        style: {
                                            margin: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.cost = '1';
                                                this.id = params.row.id;
                                                this.modal1 = true;
                                            }
                                        }
                                    }, '同意申请'),
                                    h('Button', {
                                        props: {
                                            type: 'error'
                                        },
                                        style: {
                                            margin: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.cost = '-1';
                                                this.id = params.row.id;
                                                this.modal1 = true;
                                            }
                                        }
                                    }, '拒绝申请'),
                                    h('Button', {
                                        props: {
                                            type: 'primary'
                                        },
                                        style: {
                                            margin: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                console.log(params.row.id)
                                                let argu = {id: params.row.id};
                                                this.$router.push({
                                                    name: 'user_detail',
                                                    params: argu
                                                });
                                            }
                                        }
                                    }, '红娘详情'),
                                    h('Button', {
                                        props: {
                                            type: 'warning'
                                        },
                                        style: {
                                            margin: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                let argu = {id: params.row.id};
                                                this.$router.push({
                                                    name: 'clients',
                                                    params: argu
                                                });
                                            }
                                        }
                                    }, '客户列表')
                                ]);
                            }else{
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary'
                                        },
                                        style: {
                                            margin: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                console.log(params.row.id)
                                                let argu = {id: params.row.id};
                                                this.$router.push({
                                                    name: 'user_detail',
                                                    params: argu
                                                });
                                            }
                                        }
                                    }, '红娘详情'),
                                    h('Button', {
                                        props: {
                                            type: 'warning'
                                        },
                                        style: {
                                            margin: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                let argu = {id: params.row.id};
                                                this.$router.push({
                                                    name: 'clients',
                                                    params: argu
                                                });
                                            }
                                        }
                                    }, '客户列表')
                                ]);
                            }
                        }
                    }
                ],
                modal: false,
                value: '',
                information: [],
                title: '',
                msgBiz: '',
                loading: false,
                brokerLecturerData: []
            };
        },
        methods: {
            ok () {
                let self = this,
                    data = {
                        status: this.cost
                    }
                uAxios.put('admin/check/matchmaker/' + self.id, data).then((response) => {
                    if (response.data.code === 0) {
                        this.$Message.info('操作成功');
                        this.getlist(this.currentPage)
                    } else {
                        this.$Modal.error({
                            content: response.data.message
                        });
                    }
                });
            },
            cancel () {
                console.log(this.value)
                let self = this
                let data = {
                    title: this.value,
                    msgBiz: this.msgBiz
                }
                uAxios.put('profiles/' + self.id, data).then((response) => {
                    if (response.data.code === 0) {
//                      this.$Modal.error({
//                          content: '删除成功'
//                      });
                        this.$Message.info('修改成功');
                        this.getlist(this.currentPage)
                    } else {
                        this.$Modal.error({
                            content: response.data.message
                        });
                    }
                });
            },
            getTab (type) {
                // 获得激活的Tab页
                console.log(type)
                this.activeTab = type;
                this.getlist(1)
            },
            handlePage (num) {
                // 分页
                this.currentPage = num;
                this.getlist(num);

            },
            getlist (page) {
                let self = this;
                self.loading = true
                uAxios.get('admin/matchmakers?page=' + page + '&status=' + self.activeTab + '&keyword=' + self.searchKeyword)
                    .then(res => {
                        let result = res.data.data;
                        console.log(result)
                        self.information = result.data
                        console.log(self.information)
                        self.orgTotal = result.total;
                        self.loading = false
                        // self.searchKeyword = ''
                    });
            },
            remove (index,_id) {
                this.information.splice(index, 1);
                console.log(_id)
                uAxios.delete('profiles/' + _id)
                    .then(res => {
                        this.$Message.info('删除成功');
                    });
            },
            handleSearch () {
                this.getlist(1);
            }
        },
        mounted () {
            // if (Cookies.get('admin_type') === 'matcher') {
            //     return this.$router.push({
            //         name: 'error-403',
            //         params: ''
            //     });
            // }
            this.getlist('1');
        }
    };
</script>

<style lang="less">
    /*@import "../../styles/common";*/
    .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
        height: 120px;
        margin-top: -16px;
    }

    .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
        background: #fff;
        padding: 16px;
    }

    .demo-tabs-style1 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
        border-color: transparent;
    }

    .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
        border-color: #fff;
    }
    .demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab{
        border-radius: 0;
        background: #fff;
    }
    .demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active{
        border-top: 1px solid #3399ff;
    }
    .demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active:before{
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background: #3399ff;
        position: absolute;
        top: 0;
        left: 0;
    }
</style>
