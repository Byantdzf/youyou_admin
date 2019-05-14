<template>
    <div v-model="activeTab">
        <Tabs>
            <TabPane label="备注管理"  name="complain">
                <!--<Col span="24">-->
                <!--<Input-->
                        <!--v-model="searchKeyword"-->
                        <!--@on-enter="handleSearch"-->
                        <!--placeholder="关键字搜索..."-->
                        <!--style="width: 200px; margin-bottom: 22px;"/>-->
                <!--<span @click="handleSearch" >-->
                    <!--<Button type="primary" icon="ios-search" style=" margin-bottom: 22px;">搜索</Button>-->
                <!--</span>-->
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
                            <div style="display: inline-block;margin-left: 12px;">
                                <span class="font_1 _bold">性别：</span>
                                <span class="font_16">{{sex}}</span>
                            </div>
                        </Card>
                    </Col>
                    <Col span="6" offset="7" style="text-align: center;">
                        <Card>
                            <span style="margin-right: 4%;" @click="addNote">
                                <Button type="success" style=" margin-bottom: 22px;" @click="addNote">新增备注</Button>
                            </span>
                        </Card>
                    </Col>
                </Row>
                <Row style="width: 100%;margin-top: 26px;">
                    <Col span="24">
                    <Card >
                        <p slot="title">备注列表</p>
                        <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
                        <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                              style="float:right;margin-top:5px;"></Page>
                        <div style="clear: both"></div>
                    </Card>
                    </Col>
                </Row>
                <!--</Col>-->
            </TabPane>
        </Tabs>
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
                orgColumns: [
                    {
                        title: 'user ID',
                        key: 'id',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
//                    {
//                        title: '用户名',
//                        key: 'name',
//                        align: 'center',
////                        width: 100,
//                        editable: true
//                    },
//                    {
//                        title: '头像',
//                        key: 'avatar',
//                        render: (h, params) => {
//                            return h('img', {
//                                attrs: {
//                                    src: params.row.avatar
//                                },
//                                style:{
//                                    width: '48px',
//                                    height: '48px',
//                                    borderRadius: '50%',
//                                    marginTop: '6px',
//                                    border: '4px solid #f4f4f4'
//                                },
//                                on: {
//                                    click: () => {
//                                        let argu = {id: params.row.id};
//                                        this.$router.push({
//                                            name: 'user_detail',
//                                            params: argu
//                                        });
//                                    }
//                                }
//                            });
//                        },
//                        width: 80,
//                        align: 'center'
//                    },
                    {
                        title: '服务类型',
                        key: 'type',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '备注',
                        key: 'comment',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '备注图片',
                        key: 'pics',
                        render: (h, params) => {
                            for(let item of params.row.pics){
                                return h('img', {
                                    attrs: {
                                        src: item
                                    },
                                    style:{
                                        width: '48px',
                                        height: '48px',
                                        marginTop: '6px',
                                        border: '4px solid #f4f4f4'
                                    },
                                    on: {
                                        click: () => {
//                                            let argu = {id: params.row.id};
//                                            this.$router.push({
//                                                name: 'user_detail',
//                                                params: argu
//                                            });
                                        }
                                    }
                                });
                            }
                        },
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '备注时间',
                        key: 'created_at',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
//                    {
//                        title: '性别',
//                        key: 'sex',
//                        align: 'center',
////                        width: 100,
//                        render: (h, params) => {
//                            return h('div', [
//                                h('span', params.row.sex == '1' ? '男' : '女')
//                            ]);
//                        }
//                    },
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
                                            let argu = {id: params.row.id, note_id: params.row.id};
                                            this.$router.push({
                                                name: 'note_detail',
                                                params: argu
                                            });
                                        }
                                    }
                                }, '查看详情')
                            ]);
                        }
                    }
                ],
                modal: false,
                value: '',
                information: [],
                title: '',
                msgBiz: '',
                loading: false,
                sex: '',
                brokerLecturerData: []
            };
        },
        methods: {
            addNote(id){
                let argu = {id: this.id};
                this.$router.push({
                    name: 'note_detail',
                    params: argu
                });
            },
            handlePage (num) {
                // 分页
                this.currentPage = num;
                this.getlist(num);

            },
            getlist (page) {
                let self = this;
                uAxios.get('admin/matchmaker/clients/' + self.id + '?page=' + page )
                    .then(res => {
                        let result = res.data.data;
                        self.name = result.name;
                        self.avatar = result.avatar;
                        self.mobile = result.mobile;
                        self.sex = result.sex == 1? '男': '女';
                    });
                self.loading = true
                uAxios.get('admin/clients/' + self.id + '/comments?page=' + page )
                    .then(res => {
                        let result = res.data.data;
                        console.log(result)
                        self.information = result.data
                        self.orgTotal = result.total;
                        self.loading = false;
                    });
            },
            handleSearch () {
                let query = '&keyword=' + this.searchKeyword;
                let self = this;
                let page = 1;
                self.loading = true
                uAxios.get('admin/users/' + self.id + '/matching/rates?page=' + page + query)
                    .then(res => {
                        let result = res.data.data;
                        self.information = result.data.map((item) => {
                            return {
                                new_member: item.new_member,
                                age: item.age,
                                belief: item.belief,
                                residence_province: item.residence_province,
                                residence_city: item.residence_city,
                                grow_province: item.grow_province,
                                grow_city: item.grow_city,
                                photos: item.photos,
                                identification_photos: item.identification_photos,
                                graduate_photos: item.graduate_photos,
                                other_photos: item.other_photos,
                                weight: item.weight,
                                name: item.rate_user.name,
                                avatar: item.rate_user.circle_avatar,
                                type: item.rate_user.type,
                                sex: item.rate_user.sex,
                                id: item.rate_user.id
                            };
                        })
                        self.orgTotal = result.total;
                        self.loading = false
                        // self.searchKeyword = ''

                    });
            }
        },
        mounted () {
            this.id = this.$route.params.id;
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
