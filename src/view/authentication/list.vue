<template>
    <div v-model="activeTab">
        <Tabs @on-click="getTab">
            <TabPane :label="item.title"  :name="item.jump" v-for="item,index in tab" :key="index">
                <Input
                        v-model="searchKeyword"
                        @on-enter="createLabel"
                        placeholder="搜索用户..."
                        style="width: 200px; margin-bottom: 22px;"/>
                <span @click="createLabel" >
                    <Button type="primary" icon="search" style=" margin-bottom: 22px;">搜索</Button>
                </span>
                <!--<span style="float: right"  @click="complainList" >-->
                    <!--<Button type="error" style=" margin-bottom: 22px;">投诉列表</Button>-->
                <!--</span>-->
                <!--<Card style="margin-bottom: 32px">-->
                    <!--<div slot="title">-->
                        <!--<Icon type="ionic"></Icon>-->
                        <!--点击标签筛选-->
                        <!--<span style="background-image: linear-gradient(to right, #c8241b, #fc6906);box-shadow:1px 1px 12px #fc9185;padding:2px 7px;color: white;text-align: center;border-radius: 32px;margin-right: 12px;">{{total}}人</span>-->
                    <!--</div>-->
                    <!--<div  v-for="(item,index) in labels" style="margin-bottom: 12px;display: inline-block;margin-right: 12px">-->
                        <!--<span style="margin-right: 6px;line-height: 56px;">{{item.title}}</span><i-switch @on-change="change(item,$event)" :disabled="item.disabled" v-model="item.active" style="margin-bottom: 2px"/>-->
                    <!--</div>-->
                    <!--<div>-->
                        <!--<Tag v-for="item in count" :key="item" closable @on-close="handleClose2(item,$event)">{{item}}</Tag>-->
                    <!--</div>-->
                <!--</Card>-->
                <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
                <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                      style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
            </TabPane>
        </Tabs>
        <Modal
                v-model="modal1"
                title='审核信息'
                ok-text="通过审核"
                @on-ok="ok">
            <div style="font-size: 14px; font-weight: bold;">
                    <p style="width:84px;display: inline-block;">姓名：</p>
                    <Input prefix="ios-contact" placeholder="Enter name" :value="name" v-model="name" style="width: auto;margin-bottom: 12px;" /><br/>
                    <span>身份证号码：</span>
                    <Input suffix="ios-search" placeholder="Enter IDcard" :value="card_num" v-model="card_num" style="width: auto;margin-bottom: 12px" /><br/>
                    <span>身份证：</span><br/>
                <div v-for="item in identification_photos"  style="max-width: 92%;margin: 12px auto;">
                    <img :src="item" alt="" style="width: 100%;border-radius: 4px;box-shadow: 1px 1px 12px #d3d3d3;">
                </div>
            </div>
        </Modal>
        <Modal
                v-model="modal"
                title='温馨提示'
                ok-text="OK"
                @on-ok="deleteUser"
                no-cancel>
            <p>是否确认删除佳偶？</p>
        </Modal>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import uAxios from '../../api/index';
    import config from '../../api/config';
    // import moment from 'moment';

    export default {
        search: '',
        name: 'orders',
        data () {
            return {
                activeTab: '0',
                tab: [{title:'未审核', jump: '0'},{title:'已审核',jump: '1'}],
                currentPage: 1,
                searchKeyword: '',
                modal: false, // 弹框
                orgTotal: 0,
                id: '',
                modal1: false,
                social: '',
                total: '',
                cost: '',
                count: [],
                card_num: 0,
                identification_photos: [],
                jump: {
                    is_vip: 0,
                    is_match: 0,
                    has_maker: 0,
                    type: 'all',
                    sex: 0
                },
                name: '',
                Columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: 'ID',
                        align: 'center',
                        key: 'id'
                    },
                    {
                        title: '名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '手机号',
                        align: 'center',
                        key: 'mobile'
                    },
                    {
                        title: '头像',
                        key: 'updatedAt',
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
                        align: 'center'
                    },
                    {
                        title: '性别',
                        align: 'center',
                        width: 100,
                        key: 'sex'
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
                                                this.identification_photos = params.row.identification_photos;
                                                this.name = params.row.name;
                                                this.card_num = params.row.card_num;
                                                this.modal1 = true;
                                            }
                                        }
                                    }, '查看信息'),
                                    h('Button', {
                                        props: {
                                            type: 'primary'
                                        },
                                        style: {
                                            margin: '5px'
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
                                    }, '用户详情')
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
                                                let argu = {user_detail_id: params.row.id};
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
                    }
                ],
                value: '',
                information: [],
                loading: false,
                type: ''
            };
        },
        watch: {
        },
        methods: {
            ok () {
                let self = this,
                    data = {
                        name: this.name,
                        card_num: this.card_num
                    }
                    console.log(data)
                uAxios.put('admin/users/' + self.id + '/approved', data).then((response) => {
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
            handleClose2 (name,event) {
                const index = this.count.indexOf(name);
                this.count.splice(index, 1);
                this.labels[0].active = false
                if (this.count.length == 0) {
                    this.labels[0].disabled = false
                }
                this.getlist(1)
                let arr = [
                    {key: 'is_vip', value: 'vip', index: 1},
                    {key: 'is_match', value: '良人佳偶认证', index: 2},
                    {key: 'has_maker', value: '有跟进红娘', index: 3},
                    {key: 'is_approved', value: '实名认证', index: 4}
                ]
                for(let item of arr){
                    switch (this.count.includes(item.value)){
                        case true:
                            this.labels[item.index].active = true;
                            break;
                        default:
                            this.labels[item.index].active = false
                    }
                }
                switch (this.count.indexOf('男') == -1 && this.count.indexOf('女') == -1){
                    case true:
                        this.labels[6].active = false;
                        break;
                    default:
                        this.labels[6].active = true;
                }
                switch (this.count.indexOf('单身') == -1 && this.count.indexOf('介绍人') == -1){
                    case true:
                        this.labels[5].active = false;
                        break;
                    default:
                        this.labels[5].active = true;
                }
                if (this.count.length != 0) {
                    this.labels[0].disabled = true;
                }
            },
            change (item, status) {
                if (status) {
                    if (item.title === '全部') {
                        for (let index in this.labels) {
                            this.labels[index].active = true
                        }
                    }else {
                        this.labels[0].disabled = true
                    }
                    for (let data of item.item) {
                        this.count.push(data);
                    }
                } else {
                    if (item.title === '全部') {
                        for (let index in this.labels) {
                            this.labels[index].active = false;
                        }
                    }
                    for (let data of item.item) {
                        let index = this.count.indexOf(data);
                        if (index != -1) {
                            this.count.splice(index, 1);
                        }
                    }
                    if (this.count.length == 0) {
                        this.labels[0].disabled = false;
                    }
                }
                this.getlist(1)
//                this.$Message.info('开关状态：' + status);
            },
            createLabel () {
                console.log(this.searchKeyword);
                this.page = 1;
                this.getlist(1);
            },
            complainList(){
              // 投诉列表
                this.$router.push({
                    name: 'complain'
                })
            },
            filterLabel (page) {
                console.log(this.social)
                if (this.social == 1 || this.social == 2) {
                    this.type = 'single';
                } else {
                    this.type = 'marriage';
                }
                this.page = 1;
                this.getlist(1);
            },
            deleteUser () {
                let self = this
                uAxios.delete('admin/good/match/' + self.id ).then((response) => {
                    if (response.data.code === 0) {
                        this.$Message.info('删除成功');
                        this.getlist(this.currentPage);
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
                if (this.social.length == 0) {
                    this.getlist(num);
                } else {
                    this.filterLabel(num);
                }

            },
            searchTitle () {
                let arr = [
                    {key: 'is_vip', value: 'vip'},
                    {key: 'is_match', value: '良人佳偶认证'},
                    {key: 'has_maker', value: '有跟进红娘'},
                    {key: 'is_approved', value: '实名认证'}
                ]
                for(let item of arr){
                    switch (this.count.includes(item.value)){
                        case true:
                            this.jump[item.key] = 1;
                            break;
                        default:
                            this.jump[item.key] = 0;
                    }
                }
                if(this.count.includes('男')){
                    this.jump.sex = '1';
                }else if(this.count.includes('女')){
                    this.jump.sex = '2';
                }else{
                    this.jump.sex = '0';
                }
                if(this.count.includes('男') && this.count.includes('女')){
                    this.jump.sex = '0';
                }
                if(this.count.includes('单身')){
                    this.jump.type = 'single';
                }else if(this.count.includes('介绍人')){
                    this.jump.type = 'marriage';
                }else{
                    this.jump.type = '';
                }
                if(this.count.includes('单身') && this.count.includes('介绍人')){
                    this.jump.type = '';
                }
                console.log(this.jump)
            },
            getlist (page) {
                let self = this,
                    jump = ''
                self.searchTitle()
                self.loading = true
                for(let item in self.jump){
                    jump = jump + `&${item}=${self.jump[item]}`
                }
                uAxios.get('admin/approve/users?page=' + page  + '&keyword=' + self.searchKeyword + jump + '&is_approved=' + self.activeTab )
                    .then(res => {
                       let result = res.data.data;
                       self.total = res.data.data.total
                       self.information = result.data.map((item)=>{
                          return {
                              avatar: item.circle_avatar,
                              created_at:  item.created_at,
                              id: item.id,
                              mobile: item.mobile,
                              name: item.name,
                              sex: item.sex == 1 ? '男' : '女',
                              rank: item.rank,
                              type: item.type == 'single' ? '单身' : '介绍人',
                              card_num: item.card_num,
                              identification_photos: item.identification_photos,
                              is_good_match: item.is_good_match == '0' ? '未认证' : '已认证',
                              address: `${item.province}${item.city}` == '' ? '暂无' : `${item.province} ${item.city}`
                          }
                       })
                        console.log(self.information)
                        self.orgTotal = result.total
                        self.loading = false
                    });
            },
            handleSearch () {
                let query = '&keyword=' + this.searchKeyword;
                let self = this;
                let page = 1;
                uAxios.get('posts?page=' + page + query)
                    .then(res => {
                        let result = res.data.data;
                        self.orgData = result.data
                        console.log(self.orgData)
                        self.orgTotal = result.total;
                        // self.searchKeyword = ''
                    });
            }
        },
        mounted () {
            // if (Cookies.get('admin_type') === 'matcher') {
            //     return this.$router.push({
            //         name: 'error-403',
            //         params: ''
            //     });
            // }
            this.getlist(1)
            // this.$store.commit('updateMenulist');
        }
    };
</script>

<style lang="less">
    /*@import "../../styles/common";*/
</style>
