<template>
    <div v-model="activeTab">
        <Tabs>
            <TabPane label="用户推荐列表"  name="complain">
                <!--<Col span="24">-->
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
                        <div style="display: inline-block;margin-left: 12px;">
                            <span class="font_1 _bold">性别：</span>
                            <span class="font_16">{{sex}}</span>
                        </div>
                    </Card>
                    </Col>
                </Row>
                <Row style="width: 100%;margin-top: 26px;">
                    <Col span="24">
                    <Card >
                        <p slot="title">推荐列表</p>
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
//                    {
//                        title: '序号',
//                        type: 'index',
//                        width: 80,
//                        align: 'center',
//                        sortable: true
//                    },
                    {
                        title: '用户ID',
                        key: 'id',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '用户名',
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
                                        let argu = {user_detail_id: params.row.id};
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
                        title: '性别',
                        key: 'sex',
                        align: 'center',
//                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('span', params.row.sex == '1' ? '男' : '女')
                            ]);
                        }
                    },
                    {
                        title: '新用户',
                        key: 'new_member',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },

                    {
                        title: '年龄',
                        key: 'age',
                        align: 'center',
                        width: 100,
                        editable: true
                    },
                    {
                        title: '信仰',
                        key: 'belief',
                        align: 'center',
                        width: 100,
                    },
                    {
                        title: '居住省',
                        key: 'residence_province',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '居住市',
                        key: 'residence_city',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },{
                        title: '成长省',
                        key: 'grow_province',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '成长市',
                        key: 'grow_city',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '生活照',
                        key: 'photos',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '身份证',
                        key: 'identification_photos',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '毕业证',
                        key: 'graduate_photos',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '其他照片',
                        key: 'other_photos',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '总权重',
                        key: 'weight',
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
                                            let argu = {user_detail_id: params.row.id};
                                            this.$router.push({
                                                name: 'user_detail',
                                                params: argu
                                            });
                                        }
                                    }
                                }, '查看信息')
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
            handlePage (num) {
                // 分页
                this.currentPage = num;
                this.getlist(num);

            },
            getlist (page) {
                let self = this;
                uAxios.get('admin/users/' + self.id + '?page=' + page )
                    .then(res => {
                        let result = res.data.data;
                        self.name = result.name;
                        self.avatar = result.avatar;
                        self.mobile = result.mobile;
                        self.sex = result.sex == 1? '男': '女';
                    });
                self.loading = true
                uAxios.get('admin/users/' + self.id + '/matching/rates?page=' + page )
                    .then(res => {
                        let result = res.data.data;
                        console.log(result)
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
            },
//            remove (index,_id) {
//                this.information.splice(index, 1);
//                console.log(_id)
//                uAxios.delete('profiles/' + _id)
//                    .then(res => {
//                        this.$Message.info('删除成功');
//                    });
//            },
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
            this.id = this.$route.params.user_recommend_id;
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
