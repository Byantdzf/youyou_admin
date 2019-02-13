<template>
	<div class="hello">
        <Tabs @on-click="getTab">
            <TabPane :label='title' name="detail">
                <Row>
                    <Col span="22" style="margin: 22px">
                    <Card>
                        <Form ref="activity" :model="activity" :label-width="100">
                            <FormItem label="活动海报" prop="image">
                                <Card>
                                    <uploadImage v-on:uploadPictures="uploadPictures" :pic="activity.poster"></uploadImage>
                                </Card>
                            </FormItem>
                            <FormItem label="活动主题" prop="name">
                                <Input v-model="activity.theme" placeholder="Enter activity theme"></Input>
                            </FormItem>
                            <FormItem label="主办方" prop="name">
                                <Row>
                                    <Input v-model="activity.host" placeholder="Enter activity host"></Input>
                                </Row>
                            </FormItem>
                            <FormItem label="费用(￥)" prop="number">
                                <Row>
                                    <Input v-model="activity.fee" placeholder="Enter activity fee"></Input>
                                </Row>
                            </FormItem>
                            <FormItem label="详情" prop="name">
                                <Row>
                                    <Input v-model="activity.detail" placeholder="Enter activity detail"></Input>
                                </Row>
                            </FormItem>
                            <FormItem label="详情链接" prop="name">
                                <Row>
                                    <Input v-model="activity.detail_path" placeholder="Enter activity detail path"></Input>
                                </Row>
                            </FormItem>
                            <FormItem label="开始时间" prop="name">
                                <Row>
                                    <Input v-model="activity.start_time" placeholder="Enter activity start_time"></Input>
                                </Row>
                            </FormItem>
                            <FormItem label="结束时间" prop="name">
                                <Row>
                                    <Input v-model="activity.end_time" placeholder="Enter activity end_time"></Input>
                                </Row>
                            </FormItem>
                            <FormItem label="省市区" prop="name">
                                <Row>
                                    <Input v-model="activity.province" placeholder="输入省份" style="max-width: 200px"></Input>
                                    <Input v-model="activity.city" placeholder="输入活动城市" style="max-width: 200px"></Input>
                                    <Input v-model="activity.dist" placeholder="输入市区/街道" style="max-width: 200px"></Input>
                                </Row>
                            </FormItem>
                            <FormItem label="地址详情" prop="name">
                                <Row>
                                    <Input v-model="activity.address" placeholder="Enter activity address"></Input>
                                </Row>
                            </FormItem>
                            <!-- <FormItem label="商品详情" prop="image">
                                <Card>
                                    <detailImage v-on:uploadPictures="detailImage" :pic="activity.detail_pic"></detailImage>
                                </Card>
                            </FormItem> -->
                        </Form>
                        <div style="text-align: center">
                            <Button type="primary" @click="handleSubmit()">{{BtnText}}</Button>

                        </div>
                    </Card>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label='活动订单' name="activity" v-if="id != 0">
                <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
                <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                      style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
            </TabPane>
        </Tabs>
	</div>
</template>

<script>
    import axios from 'axios';
    import uAxios from '../../api/index';
    import config from '../../api/config';
    //  import md5 from 'js-md5';
    //	import moment from 'moment';
    import uploadImages from '../components/uploadImages';
    import uploadImage from '../components/uploadImage';
    import dropdown from '../components/dropdown';

    export default {
        name: 'Org',
        components: {
            dropdown: dropdown,
            uploadImage:uploadImage,
        },
        data () {
            return {
                articlesId: '',
                switch1: false,
                redMun: [],    // 红娘列表
                disabled: false,
                user_is_admin: 0,
                title: '活动详情',
                BtnText: '保存',
                loading: false,
//                enterprises_id: '', // 默认企业id
                columns: [
                    {
                        title: 'Name',
                        key: 'name'
                    },
                    {
                        title: 'Age',
                        key: 'key'
                    }
                ],
                columns1: [
                    {
                        title: 'Name',
                        key: 'title'
                    },
                    {
                        title: 'Age',
                        key: 'key'
                    }
                ],
                information: [],
                VIPinformation: [],
                searchKeyword: '',
                activeTab: 'detail',
                orgColumns: [
                    {
                        title: '序号',
                        type: 'index',
//                        width: 80,
                        align: 'center',
                        sortable: true
                    },
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
                        title: '商品名称',
                        key: 'goods',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '支付状态',
                        key: 'status',
                        align: 'center',
//                        width: 100,
                        editable: true
                    },
                    {
                        title: '金额',
                        key: 'price',
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
                    }
                ],
                orgData: [],
                total: 0,
                orgTotal: 0,
                modal: false,
                name: '',
                mobile: '',
                avatar: '',
                maker_name: '',
                is_approved: '',
                photos: [],
                graduate_photos: [],
                other_photos: [],
                identification_photos: [],
                wechat_qrcode: [],
                love_characters: [],
                love_languages: [],
                character: {},
                message: {},
                client_user_id: 0,
                uploaddata: [],
                id: 0,
                //活动详情
                activity:{}
            };
        },
        methods: {
            getTab (type) {
                // 获得激活的Tab页
                this.activeTab = type;
                this.getOrder(1)
            },
            settNote() {
                let argu = {user_note_id: this.id};
                this.$router.push({
                    name: 'user_note',
                    params: argu
                });
            },
            getGropData (_id) {
                this.client_user_id = _id
            },
            uploadPictures (image) {
                this.activity.poster = image; // 轮播
            },
            // 提交表单
            handleSubmit (){
                if (this.id == 0) {
                    uAxios.post(`admin/activities`, this.activity).then(response => {
                        if (response.data.code === 0) {
                            this.$Message.success('创建成功!');
                            setTimeout(() => {
                                this.$router.push({
                                    name: 'activityList'
                                })
                            }, 800);
                        }else{
                            alert('操作失败！');
                        }
                    });
                    console.log(this.activity)
                    return;
                }
                uAxios.put(`admin/activities/${this.id}`, this.activity).then(response => {
                    if (response.data.code === 0) {
                        this.$Message.success('保存成功!');
                    }else{
                        alert('操作失败！');
                    }
                });
            },
            getOrder (page) {
                let self = this;
                self.loading = true
                uAxios.get(`admin/activities/${self.id}/orders?page=` + page + '&type=' + self.activeTab + '&keyword=' + self.searchKeyword)
                    .then(res => {
                        let result = res.data.data;
                        console.log(result)
                        self.information = result.data.map((item)=>{
                            return {
                                user_name: item.user? item.user.name: '',
                                avatar: item.user? item.user.circle_avatar: '',
                                goods: item.goods,
                                created_at: item.created_at,
                                id: item.id,
                                user_id: item.user_id,
                                status: item.pay_status,
                                price: item.price
                            }
                        })
                        console.log(self.information)
                        self.orgTotal = result.total;
                        self.loading = false
                        // self.searchKeyword = ''

                    });
            },
            getmatchmakers () {
                let self = this;
                self.loading = true
                uAxios.get('admin/matchmakers?nopage=1&keyword=' + self.searchKeyword)
                    .then(res => {
                        let result = res.data.data;
                        this.redMun = result.map((item)=>{
                            return {
                                name: item.name,
                                id: item.user_id
                            }
                        });
                        console.log(this.redMun)
                    });
            },
            handlePage (num) {
                // 分页
                this.getOrder(num);

            },
            showModal(item, type) {
                console.log(this.character)
                if(type == 'test'){
                    this.modal = true;
                    this.message = item;
                    this.message.type_v = 'test';
                    this.message.title_v = item.title;
                }else if(type == 'image'){
                    this.modal = true;
                    this.message.title_v = '预览';
                    this.message.type_v = 'image';
                    this.message.image = item;
                }else{
                    this.modal = true;
                    this.message.title_v = '了解自己的优势';
                    this.message.type_v = 'character';
                }
                console.log(this.message)
            },
            getlist (page) {
                let self = this;
                self.loading = true
                uAxios.get('admin/activities/' + self.id  )
                    .then(res => {
                        let result = res.data.data;
                        this.activity = result;
                        console.log(this.activity);
                    });
            },
        },
        mounted () {
            if (this.$route.params.activity_id != 0) {
                this.id = this.$route.params.activity_id;
                this.getlist();
                return;
            }
            this.title = this.BtnText = '创建活动';
        }
    };
</script>

<style>
	._bold{font-weight: bold}
	.float_l{float: left}
</style>
