# 祝福的密码删除

祝福会立即公开显示为「祝福 - 姓名」。访客可以长按弹幕（电脑可右键，键盘可聚焦后按 Enter/空格）并输入管理员密码删除；成功后所有打开中的页面会同步移除。

## 首次设置

1. 在 Supabase 项目的 SQL Editor 打开 [`supabase/blessings-delete-password.sql`](../supabase/blessings-delete-password.sql)。
2. 将 `chosen_password text := $password$YOUR_CHOSEN_DELETE_PASSWORD_HERE$password$;` 这一行中的占位文字替换为至少 16 个字符的唯一密码，再运行整份 SQL。只在 Supabase SQL Editor 中修改，别改本地文件；也请不要把密码发到聊天或提交到 GitHub。脚本在未替换占位文字或密码太短时会直接报错。
3. 发布网页后，提交一条测试祝福，在手机上长按并输入密码测试；错误密码应无法删除，正确密码应在各访客页面同步删除。

SQL 会保留访客公开读取和提交祝福的能力，并撤销直接删除权限。密码以 bcrypt 哈希保存在独立私有 schema；网页只在删除时把输入值发送给数据库函数校验，不会保存密码。再次运行 SQL 会替换当前管理员密码。

**密码是所有管理员共用的钥匙：**任何拿到密码的人都能删除任意祝福。请使用不常用且足够长的密码，并只发给必要的人。当前没有密码尝试次数限制，因此不要使用简单口令。
