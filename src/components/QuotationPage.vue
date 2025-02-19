<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import QRCodeVue3 from "qrcode-vue3";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const router = useRouter()
const route = useRoute()
// :item

const item = computed(() => {
  return route.params.item
})

const apiData = ref(null)

// env
const apiUrl = import.meta.env.VITE_APP_BASE_API 

const initData = () => {
  axios.get(apiUrl +'/api/erms/v1/orders/'+item.value)
    .then((res) => {
      console.log(res)
      apiData.value = res.data
    })
    .catch((err) => {
      console.log(err)
    })
}
const pdfTemplate = ref(null)
const exportToPDF = async () => {
  const element = pdfTemplate.value; // 取得要轉換的區塊
  const canvas = await html2canvas(element, {
    useCORS: true, // 啟用跨域圖片支援
    backgroundColor: "#ffffff",
  }); // 轉成 Canvas
  const imgData = canvas.toDataURL("image/png"); // 轉成圖片

  const pdf = new jsPDF({
    orientation: "portrait", // 直向
    unit: "mm",
    format: "a4",
  });

  const imgWidth = 210; // A4 寬度 (mm)
  const pageHeight = 297; // A4 高度 (mm)
  const imgHeight = (canvas.height * imgWidth) / canvas.width; // 按比例縮放圖片高度

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight); // 加入圖片
  pdf.save("download.pdf"); // 下載 PDF

}

onMounted(() => {
  initData()
})


</script>
<template>
    <div class="content">
      <div class="quotation-title">報價單詳情</div>
      <div class="quotation-info-box" ref="pdfTemplate">
        <div class="qr-code">
            <QRCodeVue3
                :width="80"
                :height="80"
                :value="'https://quotation.datapkt.com.tw/quotations/#/'+item"
                :dotsOptions="{
                    type: 'square',
                    color: '#000000',
                    gradient: {
                    type: 'linear',
                    rotation: 0,
                    colorStops: [
                        { offset: 0, color: '#000000' },
                        { offset: 1, color: '#000000' },
                    ],
                    },
                }"
                :backgroundOptions="{ color: '#ffffff' }"
                :cornersSquareOptions="{ type: 'square', color: '#000000' }"
                :cornersDotOptions="{ type: undefined, color: '#000000' }"
            />
        </div>
        <div class="head-info">
          <div class="title">口袋數據科技有限公司</div>
          <div class="sub-title">報價單</div>
          <div class="address">苗栗縣竹南鎮康德街56號</div>
          <div class="other-info">
            <div class="phone">
              <span>電話</span>
              <span>037-474873</span>
            </div>
            <div class="name">
              <span>黃先生</span>
              <span>0925-920-105</span>
            </div>
          </div>
        </div>
        <div class="customer-info" v-if="apiData">
          <div class="top">
            <div>
              <span>序號</span>
              <span>{{apiData.customer_id}}</span>
            </div>
            <div></div>
          </div>
          <div class="info">
            <div>
              <span>客戶名稱</span>
              <span>{{apiData.customer}}</span>
            </div>
            <div>
              <span>地址</span>
              <span>{{apiData.address}}</span>
            </div>
            <div>
              <span>聯絡人</span>
              <span>{{apiData.agent_customer}}</span>
            </div>
            <div>
              <span>聯絡電話</span>
              <span>{{apiData.phone}}</span>
            </div>
            <div>
              <span>統編</span>
              <span>{{apiData.tax_id_number}}</span>
            </div>
          </div>
        </div>
        <div class="product-info" v-if="apiData">
          <div class="top">
            <div>
              <span>出貨單號</span>
              <span>{{item}}</span>
            </div>
            <div></div>
          </div>
          <div class="info">
            <table class="product-table" v-if="apiData.products">
              <thead>
                <tr>
                  <th>序號</th>
                  <th>商品名稱</th>
                  <!-- <th>商品規格</th> -->
                  <th>數量</th>
                  <th>單價(NT)</th>
                  <th>金額(NT)</th>
                  <th>備註</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in apiData.products" :key="index">
                  <td>{{index+1}}</td>
                  <td>{{product.product_name}}</td>
                  <!-- <td>{{item.product_name}}</td> -->
                  <td>{{product.quantity}}</td>
                  <td>{{product.unit_price}}</td>
                  <td>{{product.price}}</td>
                  <td>{{product.note}}</td>
                </tr>
              </tbody>
            </table>
            <div class="other-detail">
              <div class="top">
                <div>
                  <span>備註</span>
                  <span></span>
                </div>
              </div>
              <div class="med">
                {{
                  apiData.note
                }}
              </div>
              <div class="footer">
                <div>
                  <div>
                    <span>總數量</span>
                    <span>{{apiData.quantity}}件</span>
                  </div>
                  <div>
                    <span>合計</span>
                    <span>{{apiData.total_price}}</span>
                  </div>
                </div>
                <div>
                  <div>
                    <span>稅額</span>
                    <span>${{ apiData.is_tax?apiData.total_price*0.05:0}}</span>
                  </div>
                </div>
                <div>
                  <div>
                    <span>總計</span>
                    <span>${{apiData.total_price + (apiData.is_tax?apiData.total_price*0.05:0)}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sales" v-if="apiData">
          <img src="@/assets/images/people.svg" alt="" srcset="">
          <div>
            經辦人
          </div>
          <div>
            {{apiData.agent}}
          </div>
        </div>
        <!-- <div class="download-pdf">
          <button @click="exportToPDF">下載PDF</button>
        </div> -->
      </div>
    </div>
</template>
<style lang="scss" scoped>
.content {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 744px;
  padding: 16px;
  min-height: 100%;
  .quotation-title {
    font-weight: 700;
    font-size: 17px;
    line-height: 23.8px;
    letter-spacing: 5%;
    color: #000;
    text-align: center;
    height: 40px;
  }
  .quotation-info-box {
    position: relative;
    width: 100%;
    gap: 16px;
    border-radius: 10px;
    border-width: 1px;
    background: #ffffff;
    border: 1px solid #dee2e6;
    box-shadow: 1.5px 1.5px 8px 0px #0000001a;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .qr-code {
      position: absolute;
      top: 16px;
      right: 16px;
    }

    > .head-info {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 0;
      gap: 8px;
      .title {
        font-weight: 500;
        font-size: 18px;
        line-height: 21.6px;
        letter-spacing: 0%;
        color: #2f2f2f;
      }
      .sub-title {
        font-weight: 500;
        font-size: 18px;
        line-height: 21.6px;
        letter-spacing: 0%;
        color: #2f2f2f;
      }
      .address {
        font-weight: 400;
        font-size: 15px;
        line-height: 18px;
        letter-spacing: 0%;
        text-align: center;
        color: #6d6d6d;
      }
      .other-info {
        display: flex;
        justify-content: space-around;
        width: 100%;
        padding: 0 16px;
        gap: 4px;
        .phone {
          display: flex;
          gap: 8px;
          span {
            font-weight: 400;
            font-size: 15px;
            line-height: 18px;
            letter-spacing: 0%;
            text-align: center;
            color: #6d6d6d;
            &:nth-child(2) {
              color: #2f2f2f;
            }
          }
        }
        .name {
          display: flex;
          gap: 8px;
          span {
            font-weight: 400;
            font-size: 15px;
            line-height: 18px;
            letter-spacing: 0%;
            text-align: center;
            color: #6d6d6d;
            &:nth-child(2) {
              color: #2f2f2f;
            }
          }
        }
      }
    }

    .customer-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
      .top {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        div {
          display: flex;
          gap: 8px;
          span {
            font-weight: 400;
            font-size: 15px;
            line-height: 18px;
            letter-spacing: 0%;
            text-align: center;
            color: #6d6d6d;
            &:nth-child(2) {
              color: #2f2f2f;
            }
          }
        }
      }
      .info {
        width: 100%;
        min-height: 132px;
        padding: 16px;
        gap: 4px;
        border-radius: 5px;
        background: #f0f7fe;

        // div 兩個一列 並且左右對齊
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;

        > div {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          span {
            font-weight: 400;
            font-size: 15px;
            line-height: 18px;
            letter-spacing: 0%;
            color: #6d6d6d;
            &:nth-child(1) {
              width: 60px;
              // 文字左右平均分配
              text-align: justify;
              text-align-last: justify;
            }
            &:nth-child(2) {
              width: calc(100% - 60px - 12px);
              color: #2f2f2f;
            }
          }
        }
      }
    }

    .product-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
      .top {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        div {
          display: flex;
          gap: 8px;
          span {
            font-weight: 400;
            font-size: 15px;
            line-height: 18px;
            letter-spacing: 0%;
            text-align: center;
            color: #6d6d6d;
            &:nth-child(2) {
              color: #2f2f2f;
            }
          }
        }
      }
      .info {
        .product-table{
          width: 100%;
          border-collapse: collapse;
          thead{
            tr{
              th{
                font-weight: 500;
                font-size: 15px;
                line-height: 18px;
                letter-spacing: 0%;
                color: #3C3C3C;
                background: #F6F6F6;
                padding: 9px 16px;
                border: 2px solid #F6F6F6;
              }
            }
          }
          tbody{
            tr{
              td{
                padding: 12px;
                color: #303133;
                font-weight: 400;
                font-size: 15px;
                line-height: 18px;
                letter-spacing: 0%;
                text-align: center;
                border: 2px solid #F6F6F6;
              }
            }
          }
        }
        >.other-detail {
          padding: 12px;
          gap: 8px;
          border: 2px solid #F6F6F6;
          border-top: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          .top {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            div {
              display: flex;
              gap: 8px;
              span {
                font-weight: 400;
                font-size: 15px;
                line-height: 18px;
                letter-spacing: 0%;
                text-align: center;
                color: #6d6d6d;
                &:nth-child(2) {
                  color: #2f2f2f;
                }
              }
            }
          }
          .med {
            font-weight: 400;
            font-size: 15px;
            line-height: 18px;
            letter-spacing: 0%;
            color: #2f2f2f;
          }
          .footer {
            padding: 16px 0 0 0;
            display: flex;
            flex-direction: column;
            gap: 4px;
            >div{
              display: flex;
              justify-content: end;
              gap: 12px;
              &:nth-child(1),
              &:nth-child(2){
                >div{
                  display: flex;
                  gap: 8px;
                  span{
                    font-weight: 400;
                    font-size: 15px;
                    line-height: 18px;
                    letter-spacing: 0%;
                    color: #6d6d6d;
                    &:nth-child(2){
                      color: #2f2f2f;
                    }
                  }
                }
              }
              &:nth-child(3){
                >div{
                  display: flex;
                  gap: 8px;
                  span{
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 19.2px;
                    letter-spacing: 0%;
                    color: #2f2f2f;
                    &:nth-child(2){
                      color: #EB4D3D;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    .sales{
      display: flex;
      justify-content: end;
      gap: 8px;
      img{
        width: 20px;
        height: 20px;
      }
      >div{
        font-weight: 400;
        font-size: 15px;
        line-height: 18px;
        letter-spacing: 0%;
        color: #2f2f2f;
      }
    }
    .download-pdf{
      display: flex;
      justify-content: center;
      button{
        padding: 6px 12px;
        border-radius: 5px;
        background: #EB4D3D;
        color: #ffffff;
        font-weight: 500;
        font-size: 15px;
        line-height: 18px;
        letter-spacing: 0%;
        border: none;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &:hover{
          background: #c83f30;
        }
      }
    }
  }
}

@media print{
  .content{
    background: #ffffff;
    .download-pdf{
      display: none;
    }
  }
}
</style>
