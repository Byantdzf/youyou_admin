<template>
    <div>
        <Tabs>
            <TabPane label="备注管理"  name="complain">
                <Row>
                    <Col span="24">
                        <Card >
                            <RadioGroup v-model="type" v-for="item,index in RadioList" :key="index">
                                <Radio :label="item.title"></Radio>
                            </RadioGroup>
                        </Card>
                    </Col>
                </Row>
                <Row style="width: 100%;margin-top: 26px;">
                    <Col span="24">
                        <Card >
                            <p slot="title">备注图片</p>
                            <uploadImage v-on:uploadPictures="detailImage" :pic="pics"></uploadImage>
                        </Card>
                    </Col>
                </Row>
                <Row style="width: 100%;margin-top: 26px;">
                    <Col span="24">
                    <Card >
                        <p slot="title">备注信息</p>
                        <div>
                            <Input v-model="comment" type="textarea" :rows="4" placeholder="Enter something..." />
                        </div>
                    </Card>
                    </Col>
                </Row>
                <!--<Row style="width: 100%;margin-top: 26px;">-->
                    <!--<Col span="24">-->
                    <!--<Card >-->
                        <!--<p slot="title">服务进度</p>-->
                        <!--<div>-->
                            <!--<Checkbox v-model="single">确认扣除服务</Checkbox>-->
                        <!--</div>-->
                    <!--</Card>-->
                    <!--</Col>-->
                <!--</Row>-->
                <Button type="success" size="large" @click="handleSubmit" style="margin: 25px auto;margin-left: 48%;">保存</Button>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import uAxios from '../../api/index';
    import config from '../../api/config';
    import uploadImage from '../components/uploadImages';

    export default {
        search: '',
        name: 'index',
        components: {
            uploadImage: uploadImage,
        },
        data () {
            return {
                id: '',
                type: '',
                comment: '',
                pics: [],
                note_id: 0,
                RadioList: [
                    {title: '电话访问（免费）'},
                    {title: '见面服务'},
                    {title: '托管服务'}
                ], // 单选项
            };
        },
        methods: {
            detailImage (image) {
                this.pics = image;
            },
            getlist () {
                let self = this;
                uAxios.get('admin/clients/comments/' + self.note_id)
                    .then((res) => {
                        let result = res.data.data;
                        console.log(result)
                        this.pics = result.pics
                        this.comment = result.comment
                        switch (result.type){
                            case 'mobile':
                                this.type = '电话访问（免费）';
                                break;
                            case 'active':
                                this.type = '见面服务';
                                break;
                            case 'passive':
                                this.type = '托管服务';
                                break;
                        }
                    });
            },
            handleSubmit() {
                let type = '',
                    self = this
                switch (this.type){
                    case '电话访问（免费）':
                        type = 'mobile';
                        break;
                    case '见面服务':
                        type = 'active';
                        break;
                    case '托管服务':
                        type = 'passive';
                        break;
                }
                let data = {
                    type: type,
                    comment: this.comment,
                    pics: this.pics
                }
                if (this.note_id == 0) {
                    uAxios.post('admin/clients/' + self.id + '/comments', data)
                        .then(res => {
                            let result = res.data;
                            console.log(result.code)
                            if (result.code === 0) {
                                this.$Notice.success({
                                    title: '系统提示：',
                                    desc: '备注成功！'
                                });
                            }
                        });
                } else {
                    uAxios.put('admin/clients/comments/' + self.note_id, data)
                        .then(res => {
                            let result = res.data;
                            console.log(result.code)
                            if (result.code === 0) {
                                this.$Notice.success({
                                    title: '系统提示：',
                                    desc: '修改成功！'
                                });
                            }
                        });
                }

            }
        },
        mounted () {
            this.id = this.$route.params.id;
            if (this.$route.params.note_id) {
                this.note_id = this.$route.params.note_id;
                this.getlist(1);
            }
            console.log(this.note_id)
        }
    };
</script>

<style lang="less">
</style>
