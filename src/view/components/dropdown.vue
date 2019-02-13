<template>
    <div class="compose">
        <Dropdown>
            <Input  :placeholder="title" readonly="readonly" :value="InputValue" style="width: 300px" ></Input>
            <DropdownMenu slot="list">
                <Input  placeholder="输入关键字"  v-model="searchVal" style="padding: 6px 12px;"></Input>
                <div style="min-width: 250px; height: 280px;overflow-y: scroll;position: relative">
                    <p v-for="item,index in list" v-if="index<60" :key="index" @click="gainValue(item)"  id="drop-p">{{item.name}}</p>
                </div>
                <!--<div style="width: 100%;height: 48px"></div>-->
                <!--<Page :current="2" :total="50" simple style="position: relative;bottom: 0"/>-->
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
  import axios from 'axios';
  import uAxios from '../../api';
  import config from '../../api/config';
  export default {
    name: 'homeConfig',
    props: ['dropData', 'id', 'title'],
    data () {
      return {
        InputValue: '',
        searchVal:'',    //默认输入为空
        letter:'',       //默认不排序
        original:false   //默认从小到大排列
      };
    },
    watch: {
      id: function () {
          console.log(this.id)
        this.dropData.forEach((item) => {
          if (item.id == this.id) {
            this.InputValue = item.name
          }
        })
      }
    },
    //通过计算属性过滤数据
    computed:{
      list: function(){
        var _this = this;
        //逻辑-->根据input的value值筛选dropData中的数据
        var arrByZM = [];//声明一个空数组来存放数据
        for (var i=0;i<this.dropData.length;i++){
          //for循环数据中的每一项（根据name值）
          if(this.dropData[i].name.search(this.searchVal) != -1){
            //判断输入框中的值是否可以匹配到数据，如果匹配成功
            arrByZM.push(this.dropData[i]);
            //向空数组中添加数据
          }
        }
        //逻辑-->升序降序排列  false: 默认从小到大  true：默认从大到小
        //判断，如果要letter不为空，说明要进行排序
        if(this.letter != ''){
          arrByZM.sort(function( a , b){
            if(_this.original){
              return b[_this.letter] - a[_this.letter];
            }else{
              return a[_this.letter] - b[_this.letter];
            }
          });
        }
        //一定要记得返回筛选后的数据
        return arrByZM;
      }
    },
    methods: {
      gainValue (item) {
        this.InputValue = item.name;
        this.$emit('getGropData', item.id);
      }
    },
    mounted () {
    }
  };
</script>
<style>
    #drop-p{
        padding: 0 12px;
    }
    #drop-p:hover{
        background: #d3d3d3;
    }
</style>