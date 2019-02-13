<template>
    <div v-model="activeTab">
        <Tabs @on-click="getTab">
            <TabPane label="我的服务"  name="score">
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
        <Modal
                v-model="modal1"
                title="温馨提示"
                @on-ok="ok"
        >
            <p>是否确定删除该公众号？</p>
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
    import uAxios from '../../api';
    import config from '../../api/config';

    export default {
        search: '',
        name: 'index',
        data () {
            return {
                activeTab: 'score',
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
                        title: 'ID',
                        key: 'id',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '用户名',
                        key: 'user_name',
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
                                        let argu = {user_detail_id: params.row.user_id};
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
                        title: '服务类型',
                        key: 'type',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '剩余次数',
                        key: 'num',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '服务金额',
                        key: 'price',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
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
                                }, '用户详情')
                            ]);
                        }
                    }
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
            ok () {
                let self = this
                console.log(self.id)
                uAxios.delete('profiles/' + self.id ).then((response) => {
                    if (response.data.code === 0) {
                        this.$Message.info('删除成功');
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
                uAxios.get('admin/matchmaker/services?page=' + page + '&keyword=' + self.searchKeyword)
                    .then(res => {
                        let result = res.data.data;
                        console.log(result)
                        self.information = result.data.map((item)=>{
                            return {
                                user_name: item.user.name,
                                avatar: item.user.circle_avatar,
                                type: item.type === 'active'? '见面': '托管',
                                num: item.num,
                                id: item.id,
                                user_id: item.user_id,
                                price: item.price
                            }
                        })
                        console.log(self.information)
                        self.orgTotal = result.total;
                        self.loading = false
                        // self.searchKeyword = ''

                    });
            },
            remove (index,_id) {
                this.information.splice(index, 1);
                uAxios.delete('profiles/' + _id)
                    .then(res => {
                        this.$Message.info('删除成功');
                    });
            },
            handleSearch () {
                this.getlist(1)
            }
        },
        mounted () {
            this.getlist('1')
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
