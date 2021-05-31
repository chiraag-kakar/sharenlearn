"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from myapp.views import *
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import include
from django.contrib.sitemaps.views import sitemap
from myapp.sitemaps import StaticViewSitemap

sitemaps = {
    'static': StaticViewSitemap,
}

urlpatterns = [
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),

    path('admin/', include('admin_honeypot.urls', namespace='admin_honeypot')),
    path('secret_admin/', admin.site.urls),
    # path('admin_home/',admin_home,name="admin_home"),
    # path('login_admin/',login_admin,name='login_admin'),

    path('',index,name='index') ,
    path('about/',about,name='about') ,
    path('contact/',contact,name='contact'),

    path('login/',userlogin,name='login'),
    
    
    path('signup/',signup1,name="signup"),
    path('logout/',Logout,name="logout"),

    path('profile/',profile,name="profile"),
    path('edit_profile/',edit_profile,name="edit_profile"),

    
    path('upload_notes/',upload_notes,name="upload_notes"),
    path('view_usernotes/<str:type>',view_usernotes,name="view_usernotes"),
    path('pending_notes/',pending_notes,name="pending_notes"),

    path('accepted_notes/',accepted_notes,name="accepted_notes"),
    path('rejected_notes/',rejected_notes,name="rejected_notes"),
    path('all_notes/',all_notes,name="all_notes"),
    
    path('viewall_usernotes/',viewall_usernotes,name="viewall_usernotes"),
    path('delete_usernotes/<int:pid>',delete_usernotes,name="delete_usernotes"),
    path('view_users/',view_users,name="view_users"),
    path('update_profile_photo/', update_profile_photo, name="update_profile_photo"),
    path('delete_profile_photo/', delete_profile_photo, name="delete_profile_photo"),
    path('delete_users/<int:pid>',delete_users,name="delete_users"),
    path('assign_status/',assign_status,name="assign_status"),
    path('delete_notes/<int:pid>',delete_notes,name="delete_notes"),
    path('admin_dashboard/<str:type>', admin_dashboard, name="admin_dashboard"),
    path('superadmin_dashboard/<str:type>', superadmin_dashboard, name="superadmin_dashboard"),
    path('manage_users/<str:job>', manage_users, name="manage_users"),
    path('forgot_password', forgot_password, name="forgot_password"),
    path('check_otp', check_otp, name="check_otp"),
    path('set_new_password', set_new_password, name="set_new_password"),
    path('act/<str:uid>/<str:otp>', activate_user, name="activate_user"),
    path('change_password', change_password, name="change_password"),
    path('check_u_password', check_u_password, name="check_u_password"),
    path('set_u_password', set_u_password, name="set_u_password"),
    path('cp/<str:uid>/<str:otp>', cp, name="cp"),
    path('send_otp_basic/', send_otp_basic, name="send_otp_basic"),
    path('note/<int:id>', view_note, name="view_note"),
    path('like/', like, name="like"),
    path('dislike/', dislike, name="dislike")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
