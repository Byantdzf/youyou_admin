export const getRouterData = req => {
  const routerInfoJSONStr = `[
        {"path":"/login","name":"login","meta":{"title":"Login - 登录","hideInMenu":true},"component":"Login"},
        {"path":"/","name":"_home","redirect":"/home","meta":{"notCache":true,"hideInMenu":true},"component":"Main",
        "children":[{"path":"/home","name":"home","meta":{"notCache":true,"hideInMenu":true,"title":"首页"},"component":"Home"}]},
        {"path":"/401","name":"error_401","meta":{"hideInMenu":true},"component":"Error401"},
        {"path":"/500","name":"error_500","meta":{"hideInMenu":true},"component":"Error500"},
        {"path":"*","name":"error_404","meta":{"hideInMenu":true},"component":"Error404"}
    ]`

  let routerInfos = JSON.parse(routerInfoJSONStr)
  return routerInfos
}
