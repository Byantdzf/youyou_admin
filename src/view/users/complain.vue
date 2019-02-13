<template>
    <div v-model="activeTab">
        <Tabs @on-click="getTab">
            <TabPane label="用户投诉列表"  name="complain">
                <Col span="24">
                <Input
                        v-model="searchKeyword"
                        @on-enter="handleSearch"
                        placeholder="关键字搜索..."
                        style="width: 200px; margin-bottom: 22px;"/>
                <span @click="handleSearch" >
                    <Button type="primary" icon="search" style=" margin-bottom: 22px;">搜索</Button>
                </span>
                <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
                <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                      style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
                </Col>
            </TabPane>
        </Tabs>
        <!--<Modal-->
                <!--v-model="modal1"-->
                <!--title="温馨提示"-->
                <!--@on-ok="ok"-->
        <!--&gt;-->
            <!--<p>是否确定删除该公众号？</p>-->
        <!--</Modal>-->
        <!--<Modal-->
                <!--v-model="modal"-->
                <!--title="编辑公众号"-->
                <!--@on-ok="cancel"-->
        <!--&gt;-->
            <!--<Input v-model="value" placeholder="Enter something..." style="width: 300px"></Input>-->
        <!--</Modal>-->
    </div>
</template>

<script>
    import uAxios from '../../api/index';
    import config from '../../api/config';

    export default {
        search: '',
        name: 'index',
        data () {
            return {
                activeTab: 'complain',
                currentPage: 1,
                searchKeyword: '',
                orgTotal: 0,
                fieldList: [],
                modelValue: '',
                industryList: [],
                id: '',
                addressList: [],
                modal1: false,
                orgColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '投诉人ID',
                        align: 'center',
                        key: 'user_id'
                    },
                    {
                        title: '投诉人',
                        key: 'user_name',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '投诉人头像',
                        key: 'headimg',
                        render: (h, params) => {
                            return h('img', {
                                    attrs: {
                                        src: params.row.user_avatar
                                    },
                                    style:{
                                        width: '42px',
                                        height: '42px',
//                                        borderRadius: '50%',
                                        marginTop: '6px',
                                    },
                                    on: {
                                        click: () => {
                                           let argu = {user_detail_id: params.row.user_id};
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
                        title: '投诉人ID',
                        align: 'center',
                        key: 'complaint_id'
                    },
                    {
                        title: '被投诉人',
                        key: 'complaint_name',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '被投诉人头像',
                        key: 'headimg',
                        render: (h, params) => {
                            return h('img', {
                                attrs: {
                                    src: params.row.complaint_avatar
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
                                        let argu = {user_detail_id: params.row.complaint_id};
                                        this.$router.push({
                                            name: 'user_detail',
                                            params: argu
                                        });
                                    }
                                }
                            });
                        },
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '投诉时间',
                        key: 'created_at',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
//                    {
//                        title: '操作',
//                        key: 'action',
//                        width: 150,
//                        align: 'center',
//                        render: (h, params) => {
//                            return h('div', [
//                                h('Button', {
//                                    props: {
//                                        type: 'primary',
//                                        size: 'small'
//                                    },
//                                    on: {
//                                        click: () => {
//                                            console.log(params.row.id)
//                                            let argu = {order_id: params.row.id};
//                                             this.$router.push({
//                                                 name: 'order-detail',
//                                                 params: argu
//                                             });
//                                        }
//                                    }
//                                }, '详情')
//                            ]);
//                        }
//                    }
                ],
                modal: false,
                value: '',
                information: [
                    {id: 250, updatedAt: '数据缺失'},
                    {id: 256, updatedAt: '数据缺失'},
                    {id: 257, updatedAt: '数据缺失'}
                ],
                title:'',
                msgBiz: '',
                loading: false,
                brokerLecturerData: []
            };
        },
        methods: {
//            save() {
////                this.$Message.info('未调接口...');
//                let self = this;
//                if (self.title === '') {
//                    this.$Message.info('请输入公众号名称');
//                    console.log(self.classificationList);
//                } else if (self.msgBiz === '') {
//                    this.$Message.info('请输入公众号msgBiz');
//                } else {
//                    let data = {
//                        'title': self.title,
//                        'msgBiz': self.msgBiz
//                    };
//                    console.log(data);
//                    uAxios.post('profiles', data)
//                        .then(function (response) {
//                            console.log(response.data);
//                            if (response.data.code === 0) {
//                                self.$Message.info('添加成功');
//                                setTimeout(function () {
//                                    // location.reload();
////                                    self.getlist('1')
//                                    self.title = ''
//                                    self.msgBiz = ''
//                                }, 500);
//                            } else {
//                                self.$Message.info(response.data.message);
//                            }
//                        });
//                }
//            },
//            ok () {
//                let self = this
//                console.log(self.id)
//                uAxios.delete('profiles/' + self.id ).then((response) => {
//                    if (response.data.code === 0) {
//                        this.$Message.info('删除成功');
//                        this.getlist(this.currentPage)
//                    } else {
//                        this.$Modal.error({
//                            content: response.data.message
//                        });
//                    }
//                });
//            },
//            cancel () {
//                console.log(this.value)
//                let self = this
//                let data = {
//                    title: this.value,
//                    msgBiz: this.msgBiz
//                }
//                uAxios.put('profiles/' + self.id, data).then((response) => {
//                    if (response.data.code === 0) {
////	                	this.$Modal.error({
////	                        content: '删除成功'
////	                    });
//                        this.$Message.info('修改成功');
//                        this.getlist(this.currentPage)
//                    } else {
//                        this.$Modal.error({
//                            content: response.data.message
//                        });
//                    }
//                });
//            },
            getTab (type) {
                // 获得激活的Tab页
                this.activeTab = type;
            },
            getlist (page) {
                let self = this;
                self.loading = true
                uAxios.get('admin/complaints?page=' + page )
                    .then(res => {
                        let result = res.data.data;
                        console.log(result)
                        self.information = result.data
                        self.orgTotal = result.total;
                        self.loading = false
                        // self.searchKeyword = ''

                    });
            },
            handlePage (num) {
                // 分页
                this.currentPage = num;
                this.getlist(num);
            },
            handleSearch () {
                // 搜索
                let query = '&keyword=' + this.searchKeyword;
                let self = this;
                let page = 1;
                uAxios.get('admin/complaints?page=' + page + query)
                    .then(res => {
                        let result = res.data.data;
                        console.log(result)
                        self.information = result.data
                        self.orgTotal = result.total;
                        self.searchKeyword = ''
                    });
//            },
//            remove (index,_id) {
//                this.information.splice(index, 1);
//                console.log(_id)
//                uAxios.delete('profiles/' + _id)
//                    .then(res => {
//                        this.$Message.info('删除成功');
//                    });
            }
        },
        mounted () {
            this.getlist(1)
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
