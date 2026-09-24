# 祝福共享与管理员删除

访客提交的祝福会立即公开，并按「祝福内容 - 姓名」显示。只有 Supabase Auth `app_metadata.role = blessing_admin` 的账号可以删除；数据库 RLS 是最终权限边界。

## 首次启用管理员

1. 在 Supabase 项目的 **Authentication → URL Configuration → Redirect URLs** 中加入：
   `https://wedding-invitation-chi-jade.vercel.app/admin.html`
2. 部署后打开 `https://wedding-invitation-chi-jade.vercel.app/admin.html`，输入管理邮箱并发送一次性登录链接。第一次使用会创建 Supabase Auth 用户。
3. 打开邮箱链接返回管理页，然后在 Supabase **SQL Editor** 执行 [`supabase/blessings-admin.sql`](../supabase/blessings-admin.sql)。先把文件中的两处 `YOUR_SUPABASE_AUTH_EMAIL_HERE` 换成刚才登录的邮箱。
4. 回管理页退出并重新通过邮箱链接登录。页面出现祝福列表后即可删除。

SQL 会开放匿名访客读取与提交，校验姓名最多 12 字、祝福最多 36 字，并把删除权限限制到管理员角色。它会重建 `public.blessings` 表的 RLS 策略；这个表应仅用于本邀请函的祝福。

## 手动验收

- 用两个浏览器或设备：访客 A 提交后，访客 B 应实时看到「祝福内容 - 姓名」；刷新后仍存在。
- 管理员在 `/admin.html` 删除后，两边打开的请柬都应移除该条祝福。
- 未登录或非管理员账号不能删除。
