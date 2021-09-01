<template>
  <div id="foot">
    <p>Copyright Reserved 2021 在线画展系统</p>
    <div>
      <a
        type="primary"
        :underline="false"
        href="http://localhost:8081/#/login"
        target="_blank"
      >在线画展系统后台管理页</a>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
#foot {
  background-color: #222831;
  color: #fff;
  width: 100%;
  height: 120px;
  overflow: hidden;
  p {
    padding: 0;
    width: 100%;
    text-align: center;
    height: 20px;
    margin-top: 35px;
  }
  div {
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  a:hover {
    text-decoration: underline;
    color: lightskyblue;
  }
}
</style>
