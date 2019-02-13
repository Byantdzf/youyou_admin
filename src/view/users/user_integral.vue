<template>
    <div v-model="activeTab">
        <Tabs>
            <TabPane label="用户福分记录"  name="complain">
                <Col span="24">
                <Input
                        v-model="searchKeyword"
                        @on-enter="handleSearch"
                        placeholder="关键字搜索..."
                        style="width: 200px; margin-bottom: 22px;"/>
                <span @click="handleSearch" >
                    <Button type="primary" icon="search" style=" margin-bottom: 22px;">搜索</Button>
                </span>
                <Row>
                    <Col span="11">
                    <Card >
                        <p slot="title">用户信息</p>
                        <div style="display: inline-block">
                            <span class="font_16 _bold">头像：<img :src="avatar" alt="" width="80rpx" style="box-shadow: 1px 1px 12px #c1c1c1"></span>
                        </div>
                        <div style="display: inline-block;margin-left: 22px;">
                            <span class="font_16 _bold">用户名：</span>
                            <span class="font_16">{{name}}</span>
                        </div>
                        <div style="display: inline-block;margin-left: 12px;">
                            <span class="font_1 _bold">手机号：</span>
                            <span class="font_16">{{mobile}}</span>
                        </div>
                    </Card>
                    </Col>
                </Row>
                <Row style="width: 100%;margin-top: 26px;">
                    <Col span="24">
                    <Card >
                        <p slot="title">福分记录</p>
                        <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
                        <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                              style="float:right;margin-top:5px;"></Page>
                        <div style="clear: both"></div>
                    </Card>
                    </Col>
                </Row>
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
                name: '',
                mobile: '',
                avatar: '',
                industryList: [],
                id: '',
                addressList: [],
                modal1: false,
                // label: (h) => {
                //     return h('div', [
                //         h('span', '标签一'),
                //         h('Badge', {
                //             props: {
                //                 count: 3000
                //             }
                //         })
                //     ])
                // },
                orgColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '商品名称',
                        key: 'message',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '消费类型',
                        key: 'type',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '消费金额',
                        key: 'amount',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '消费时间',
                        key: 'created_at',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '剩余金额',
                        key: 'value',
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
                information: [],
                title:'',
                msgBiz: '',
                loading: false,
                brokerLecturerData: []
            };
        },
        methods: {
            handlePage (num) {
                // 分页
                this.currentPage = num;
                this.getlist(num);

            },
            getlist (page) {
                let self = this;
                console.log(self.id)
                uAxios.get('admin/users/' + self.id + '?page=' + page )
                    .then(res => {
                        let result = res.data.data;
                        console.log(result)
                        self.name = result.name;
                        self.avatar = result.avatar;
                        self.mobile = result.mobile;
                    });
                self.loading = true
                uAxios.get('admin/users/' + self.id + '/score/histories?page=' + page )
                    .then(res => {
                        let result = res.data.data;
                        console.log(result)
                        self.information = result.data
                        self.orgTotal = result.total;
                        self.loading = false
                        // self.searchKeyword = ''

                    });
            },
            handleSearch () {
                let query = '&keyword=' + this.searchKeyword;
                let self = this;
                let page = 1;
                self.loading = true;
                uAxios.get('admin/users/' + self.id + '/score/histories?page=' + page + query)
                    .then(res => {
                        let result = res.data.data;
                        console.log(result)
                        self.information = result.data
                        self.orgTotal = result.total;
                        self.loading = false
                        // self.searchKeyword = ''

                    });
            }
        },
        mounted () {
            this.id = this.$route.params.user_integral_id;
            this.getlist(1);
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
