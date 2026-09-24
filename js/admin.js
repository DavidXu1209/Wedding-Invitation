(function () {
  'use strict';

  var settings = typeof CONFIG !== 'undefined' && CONFIG.guestNotes && CONFIG.guestNotes.supabase;
  var status = document.getElementById('admin-status');
  var loginForm = document.getElementById('admin-login');
  var emailInput = document.getElementById('admin-email');
  var panel = document.getElementById('admin-panel');
  var list = document.getElementById('admin-list');
  var count = document.getElementById('admin-count');
  var empty = document.getElementById('admin-empty');
  var refreshButton = document.getElementById('admin-refresh');
  var signOutButton = document.getElementById('admin-signout');

  if (!settings || !window.supabase || typeof window.supabase.createClient !== 'function') {
    showStatus('祝福管理暂时无法连接，请稍后重试。');
    return;
  }

  var db = window.supabase.createClient(settings.url, settings.publishableKey);

  function showStatus(message) {
    if (status) status.textContent = message;
  }

  function showLogin(message, signedIn) {
    loginForm.hidden = false;
    panel.hidden = true;
    signOutButton.hidden = !signedIn;
    if (message) showStatus(message);
  }

  function renderRows(rows) {
    list.textContent = '';
    count.textContent = String(rows.length);
    empty.hidden = rows.length > 0;

    rows.forEach(function (row) {
      var item = document.createElement('li');
      item.className = 'admin-item';
      item.setAttribute('data-wish-id', String(row.id));

      var content = document.createElement('div');
      content.className = 'admin-item__content';

      var message = document.createElement('span');
      message.className = 'admin-item__message';
      message.textContent = row.message || '';

      var name = document.createElement('span');
      name.className = 'admin-item__name';
      name.textContent = row.name || '来宾';

      var remove = document.createElement('button');
      remove.className = 'admin-delete';
      remove.type = 'button';
      remove.textContent = '删除';
      remove.setAttribute('aria-label', '删除祝福：' + (row.message || ''));
      remove.addEventListener('click', function () {
        deleteWish(row.id, item, remove);
      });

      content.appendChild(message);
      content.appendChild(name);
      item.appendChild(content);
      item.appendChild(remove);
      list.appendChild(item);
    });
  }

  function loadBlessings() {
    showStatus('正在读取祝福…');
    return db.from('blessings')
      .select('id, name, message')
      .order('id', { ascending: false })
      .then(function (result) {
        if (result.error) throw result.error;
        renderRows(result.data || []);
        showStatus('祝福已同步。');
      })
      .catch(function () {
        showStatus('无法读取祝福，请检查 Supabase 权限后重试。');
      });
  }

  function deleteWish(id, item, button) {
    if (!window.confirm('删除后，所有访客都看不到这条祝福。确定删除吗？')) return;

    button.disabled = true;
    button.textContent = '删除中…';
    db.from('blessings')
      .delete()
      .eq('id', id)
      .select('id')
      .then(function (result) {
        if (result.error) throw result.error;
        if (!result.data || !result.data.length) throw new Error('delete-not-authorized');
        item.remove();
        count.textContent = String(Math.max(0, Number(count.textContent) - 1));
        empty.hidden = list.children.length > 0;
        showStatus('祝福已删除，所有访客页面会同步移除。');
      })
      .catch(function () {
        button.disabled = false;
        button.textContent = '删除';
        showStatus('删除失败。请确认管理员权限已启用，然后重新登录。');
      });
  }

  function showAdmin() {
    loginForm.hidden = true;
    panel.hidden = false;
    signOutButton.hidden = false;
    return loadBlessings();
  }

  function inspectSession() {
    db.auth.getSession().then(function (result) {
      if (result.error) throw result.error;
      var session = result.data && result.data.session;
      var role = session && session.user && session.user.app_metadata && session.user.app_metadata.role;
      if (!session) {
        showLogin('使用管理员邮箱接收一次性登录链接。', false);
      } else if (role === 'blessing_admin') {
        showAdmin();
      } else {
        showLogin('邮箱已验证，但该账号尚无管理权限。请先按管理员说明完成授权，再退出并重新登录。', true);
      }
    }).catch(function () {
      showLogin('无法检查登录状态，请刷新页面重试。', false);
    });
  }

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var email = emailInput.value.trim();
    if (!email) return;

    var submit = loginForm.querySelector('[type="submit"]');
    submit.disabled = true;
    showStatus('正在发送登录链接…');
    db.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: new URL('/admin.html', window.location.origin).href,
        shouldCreateUser: true,
      },
    }).then(function (result) {
      if (result.error) throw result.error;
      showStatus('登录链接已发送，请打开邮箱中的链接返回此页。');
    }).catch(function () {
      showStatus('登录链接发送失败。请检查邮箱登录设置和重定向地址。');
    }).finally(function () {
      submit.disabled = false;
    });
  });

  refreshButton.addEventListener('click', loadBlessings);
  signOutButton.addEventListener('click', function () {
    db.auth.signOut().then(function () {
      showLogin('已退出登录。', false);
    }).catch(function () {
      showStatus('退出失败，请刷新页面重试。');
    });
  });

  inspectSession();
})();
