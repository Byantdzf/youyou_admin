<template>
	<div class="hello">
		<Menu mode="horizontal" theme="light" active-name="1">
			<MenuItem name="1">
				<Icon type="ios-paper"></Icon>
				用户详情
			</MenuItem>
		</Menu>
		<Row>
			<Col span="11" style="margin: 22px">
			<Card>
				<p slot="title" style="color: #ff6c4c">用户信息</p>
				<div style="width:100%;border-bottom: 2px solid #ececec;padding: 12px;">
					<span class="font_16 _bold">头像：</span>
					<img :src="orgData.avatar" alt="" width="80rpx" style="box-shadow: 1px 1px 12px #c1c1c1;float: right">
					<div style="clear: both"></div>
				</div>
				<div style="width:100%;border-bottom: 1px solid #ececec;padding: 12px;" v-for="item,index in information" :key="index">
					<div class="font_16 _bold" style="margin-top: 6px;float: left;">{{item.name}}:</div>
					<Input v-model="item.value" placeholder="Enter something..." style="float: right;max-width: 300px" />
					<div style="clear: both"></div>
				</div>
				<div style="width:100%;border-bottom: 1px solid #ececec;padding: 12px;">
					<div class="font_16 _bold" style="margin-top: 6px;float: left;">性别:</div>
					<Select v-model="sex" style="float: right;width: 300px" >
						<Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
					<div style="clear: both"></div>
				</div>
				<div style="width:100%;border-bottom: 1px solid #ececec;padding: 12px;">
					<div class="font_16 _bold" style="margin-top: 6px;float: left;">出生日期:</div>
					<DatePicker type="date" v-model="birthday"  placeholder="Select date" style="float: right;width: 300px" ></DatePicker>
					<div style="clear: both"></div>
				</div>
				<div style="width:100%;border-bottom: 1px solid #ececec;padding: 12px;">
					<div class="font_16 _bold" style="margin-top: 6px;float: left;">单身状态:</div>
					<Select v-model="state" style="float: right;width: 300px" >
						<Option v-for="item in stateList" :value="item" :key="item">{{ item }}</Option>
					</Select>
					<div style="clear: both"></div>
				</div>
				<div style="width:100%;border-bottom: 1px solid #ececec;padding: 12px;">
					<div class="font_16 _bold" style="margin-top: 6px;float: left;">宗教信仰:</div>
					<Select v-model="belief" style="float: right;width: 300px" >
						<Option v-for="item in beliefList" :value="item" :key="item">{{ item }}</Option>
					</Select>
					<div style="clear: both"></div>
				</div>
				<div style="width:100%;border-bottom: 1px solid #ececec;padding: 12px;">
					<div class="font_16 _bold" style="margin-top: 6px;float: left;">成长环境:</div>
					<Select v-model="resident_type" style="float: right;width: 300px" >
						<Option v-for="item in residentList" :value="item" :key="item">{{ item }}</Option>
					</Select>
					<div style="clear: both"></div>
				</div>
				<div style="width:100%;border-bottom: 1px solid #ececec;padding: 12px;">
					<div class="font_16 _bold" style="margin-top: 6px;float: left;">学历:</div>
					<Select v-model="degree" style="float: right;width: 300px" >
						<Option v-for="item in degreeList" :value="item" :key="item">{{ item }}</Option>
					</Select>
					<div style="clear: both"></div>
				</div>
				<div style="width:100%;border-bottom: 1px solid #ececec;padding: 12px;">
					<div class="font_16 _bold" style="margin-top: 6px;float: left;">单位性质:</div>
					<Select v-model="work_sort" style="float: right;width: 300px" >
						<Option v-for="item in work_sortList" :value="item" :key="item">{{ item }}</Option>
					</Select>
					<div style="clear: both"></div>
				</div>
				<div style="width:100%;border-bottom: 1px solid #ececec;padding: 12px;">
					<div class="font_16 _bold" style="margin-top: 6px;float: left;">行业:</div>
					<Cascader :data="industryData" v-model="industry" style="float: right;width: 300px"></Cascader>
					<div style="clear: both"></div>
				</div>
				<div style="width:100%;border-bottom: 1px solid #ececec;padding: 12px;">
					<div class="font_16 _bold" style="margin-top: 6px;float: left;">常居地:</div>
					<Cascader :data="addressData" v-model="dwell" style="float: right;width: 300px"></Cascader>
					<div style="clear: both"></div>
				</div>
				<div style="width:100%;border-bottom: 1px solid #ececec;padding: 12px;">
					<div class="font_16 _bold" style="margin-top: 6px;float: left;">成长地:</div>
					<Cascader :data="addressData" v-model="resident" style="float: right;width: 300px"></Cascader>
					<div style="clear: both"></div>
				</div>

				<!--<Table :columns="columns" :data="information" :show-header="false" :border="false" style="margin-top: 26px"></Table>-->
			</Card>
			</Col>
			<Col span="11" style="margin: 22px">
			<Card>
				<p slot="title" style="color: #ff6c4c">VIP信息</p>
				<!--<Table :columns="columns1" :data="VIPinformation" :show-header="false" :border="false" style="margin-top: 26px"></Table>-->
				<Card style="margin-top: 12px;">
					<p slot="title">生活照</p>
					<uploadImages :pic="lifePhotos" v-on:uploadPictures="uploadPictures('lifePhotos',$event)"></uploadImages>
				</Card>
				<Card style="margin-top: 12px;">
					<p slot="title">身份证</p>
					<uploadImages :pic="identification_photos" v-on:uploadPictures="uploadPictures('identification_photos',$event)"></uploadImages>
				</Card>
				<!--<Card style="margin-top: 12px;">-->
					<!--<p slot="title">毕业照</p>-->
					<!--<uploadImages :pic="graduate_photos" v-on:uploadPictures="uploadPictures('graduate_photos',$event)"></uploadImages>-->
				<!--</Card>-->
				<!--<Card style="margin-top: 12px;">-->
					<!--<p slot="title">其他证件</p>-->
					<!--<uploadImages :pic="other_photos" v-on:uploadPictures="uploadPictures('other_photos',$event)"></uploadImages>-->
				<!--</Card>-->
				<Card style="margin-top: 12px;">
					<p slot="title">二维码</p>
					<uploadImages :pic="wechat_qrcode" v-on:uploadPictures="uploadPictures('wechat_qrcode',$event)"></uploadImages>
				</Card>
			</Card>
			<div style="text-align: center;">
				<Button type="success" size="large" :loading="loading" style="margin: 25px auto; width: 120px;"  @click="save">保存</Button>
			</div>
			</Col>
		</Row>
	</div>
</template>

<script>
    import axios from 'axios';
    import uAxios from '../../api';
    import config from '../../api/config';
    //  import md5 from 'js-md5';
    //	import moment from 'moment';
    import dropdown from '../components/dropdown';
    import uploadImages from '../components/uploadImages';

    export default {
        name: 'Org',
        components: {
            dropdown: dropdown,
            uploadImages: uploadImages
        },
        data () {
            return {
                disabled: false,
                information: [],
                activeTab: 'orgInfo',
                loading: false,
                sexList: [ // 性别选择
                    {
                        value: '1',
                        label: '男'
                    },
                    {
                        value: '2',
                        label: '女'
                    }
                ],
                sex: '',
                stateList: ['未婚', '离异', '丧偶'],
                state: '',
                beliefList: ['基督教', '佛教', '伊斯兰教', '其他'],
                belief: '',
                residentList: ['城市', '农村'],
                resident_type: '',
                degreeList: ['大专', '本科', '硕士', '博士', '其他'],
                degree: '',
                work_sortList: ['事业单位', '公务员', '央企', '国企', '私企', '外企'],
                work_sort: '',
                dwell: [], // 居住地
                resident: [], // 成长地
                addressData: [], // 地址数据
                industry: [], // 行业
                industryData: [], // 行业数据
                orgColumns: [
                    {
                        key: 'updatedAt',
                        width: '150px',
                        align: 'right'
                    },
                    {
                        key: 'value',
                        align: 'left',
                        render: (h, params) => {
                            if (params.row.key === 'LOGO') {
                                return h('div', [
                                    h('Avatar', {
                                        props: {
                                            src: params.row.value,
                                            shape: 'square'
                                        },
                                        style: {
                                            width: '50px',
                                            height: '50px',
                                            margin: '10px 0'
                                        }
                                    })
                                ]);
                            } else {
                                return h('div', [
                                    h('span', params.row.value)
                                ]);
                            }
                        }
                    }
                ],
                orgData: [],
                total: 0,
                orgTotal: 0,
                modal: false,
                modal1: false,
                name: '',
                mobile: '',
                avatar: '',
                birthday: '', // 生日
                maker_name: '',
                photos: [],
                lifePhotos: [],
                graduate_photos: [],
                other_photos: [],
                identification_photos: [],
                wechat_qrcode: [],
                love_characters: [],
                love_languages: [],
                character: {},
                message: {},
                client_user_id: 0,
                uploaddata: []
            };
        },
        methods: {
            uploadPictures(key, value) {
                this[key] = value;
			},
            getlist (page) {
                let self = this;
                uAxios.get('admin/users/' + self.id + '?page=' + page )
                    .then(res => {
                        let result = res.data.data;
                        self.orgData = result;
						self.birthday = result.profile.birthday;
						self.sex = result.profile.sex;
						self.state = result.profile.state;
                        self.belief = result.profile.belief;
                        self.resident_type = result.profile.resident_type;
                        self.work_sort = result.profile.work_sort;
                        self.degree = result.profile.degree;
                        self.photos = result.profile.photos
                        self.lifePhotos = result.lifePhotos.map((item,index)=>{return item.photo})
                        self.graduate_photos = result.profile.graduate_photos
                        self.other_photos = result.profile.other_photos
                        self.identification_photos = result.profile.identification_photos
                        self.wechat_qrcode = result.profile.wechat_qrcode
                        self.dwell = [result.profile.country, result.profile.province, result.profile.city] // 长居地
//                        self.dwell = ['中国', '广东省', '深圳市']
                        self.resident = [result.profile.country, result.profile.resident_province, result.profile.resident_city] // 成长地
						self.information = [
                            {name: '用户名', value: result.name},
                            {name: '手机号', value: result.mobile},
                            {name: '身高', value: result.profile.stature},
                            {name: '体重', value: result.profile.weight},
                            {name: '身份证', value: result.card_num},
                            {name: '毕业学校', value: result.profile.graduate_school},
                            {name: '工作单位', value: result.profile.company}
						];
//                        {name: '户口类型', value: result.name},
//                        {name: '居住地', value: result.name},
//                        {name: '成长地', value: result.name},
//                        {name: '学历', value: result.name},
//                        {name: '单位性质', value: result.name},
//                        {name: '行业', value: result.name},
//                        {name: '个人简介', value: result.name},
//                        {name: '理想对象', value: result.name}
                        console.log(self.information)
//                        console.log(result)
//                        self.name = result.name;
//                        self.switch1 = result.is_admin == 0 ? false : true;
//                        self.maker_name = result.maker_name;
//                        self.is_approved = result.is_approved;
//                        self.disabled = result.maker_name == '' ? false : true;
//                        self.avatar = result.avatar;
//                        self.user_is_admin = result.user_is_admin;
//                        self.mobile = result.mobile;
//                        self.love_characters = result.love_characters;
//                        self.love_languages = result.love_languages;
//                        self.character = result.character;
//
//
//                            {
//                                name: '工作单位',
//                                key: result.profile.company
//                            },
//                            {
//                                name: '单位性质',
//                                key: result.profile.work_sort
//                            },
//                            {
//                                name: '行业',
//                                key: result.industry + '~' + result.industry_sub
//                            },
//                            {
//                                name: '加入时间',
//                                key: result.profile.created_at
//                            },
//                            {
//                                name: '推荐人',
//                                key: result.from_user_name
//                            },
//                            {
//                                name: 'VIP等级',
//                                key: result.rank_name
//                            },
//                            {
//                                name: '个人简介',
//                                key: result.profile.introduction
//                            },
//                            {
//                                name: '理想对象',
//                                key: result.profile.ideal_mate
//                            }
//
//                        ]
                        self.orgTotal = result.total;

                    });
            },
			// 赋值子行业
            getIndustryChildren (item) {
                let data = item.map((item_son) => {
                    return {
                        value: item_son,
                        label: item_son,
                    };
                })
                return data;
            },
            // 赋值子地址
            getChildren (item) {
                let data = item.son.map((item_son) => {
                    return {
                        value: item_son.name,
                        label: item_son.name,
                        id: item_son.id,
                        children: this.getChildren_son(item_son)
                    };
                })
                return data;
            },
			// 赋值子子地址
            getChildren_son (item) {
                let data = item.son.map((item_son) => {
                    return {
                        value: item_son.name,
                        label: item_son.name,
                        id: item_son.id
                    };
                })
                return data;
            },
            save () {
                this.loading = true;
//                this.$Notice.success({
//                    title: '温馨提示',
//                    desc: `保存成功，信息已更改！`
//                });
//                 this.$Notice.error({
//                     title: '接口未准备好！保存失败！',
//                     desc: `保存信息失败！`
//                 });
                var d = new Date(this.birthday);
                var  resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                let data = {
                    name: this.information[0].value,
                    mobile: this.information[1].value,
                    stature: this.information[2].value,
                    weight: this.information[3].value,
                  card_num: this.information[4].value,
                  graduate_school: this.information[5].value,
                    company: this.information[5].value,
                    sex: this.sex,
                    birthday: resDate,
                    state: this.state,
                    belief: this.belief,
                    resident_type: this.resident_type,
                    degree: this.degree, // 学历
                    work_sort: this.work_sort, // 单位性质
                    industry: this.industry, // 行业
                    dwell: this.dwell, // 常住地
                    resident: this.resident, // 成长地
                    photos: this.photos,
                    graduate_photos: this.graduate_photos,
                    other_photos: this.other_photos,
                    identification_photos: this.identification_photos,
                    wechat_qrcode: this.wechat_qrcode,
				}
				console.log(data)
				uAxios.put(`admin/users/${this.id}`,data).then((response) => {
					if (response.data.code === 0) {
						this.$Message.info('保存成功');
						this.loading = false;
						this.getlist(this.currentPage);
					} else {
						this.$Modal.error({
							content: response.data.message
						});
					}
				});
			}
        },
        mounted () {
            this.id = this.$route.params.edit_user_detail_id;
            this.getlist(1);
            uAxios.get('addresses/v2')
                .then(res => {
                    let result = res.data.data;
                    result.map((item, index, arr) => {
                        this.addressData.push(
                            {
                                value: item.name,
                                label: item.name,
                                id: item.id,
								children: this.getChildren(item)
                            }
                        );
					})
					console.log(this.addressData)
                });
            uAxios.get('industry/json')
                .then(res => {
                    let result = res.data.data;
                    result.map((item, index, arr) => {
                        this.industryData.push(
                            {
                                value: item.title,
                                label: item.title,
                                children: this.getIndustryChildren(item.items)
                            }
                        );
                    })
                    console.log(this.industryData)
                });

        }
    };
</script>

<style>
	._bold{font-weight: bold}
</style>
