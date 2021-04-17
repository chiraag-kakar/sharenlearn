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
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps},name='django.contrib.sitemaps.views.sitemap'),
    path('admin/', include('admin_honeypot.urls', namespace='admin_honeypot')),
    path('secret_admin/', admin.site.urls),
    path('about',about,name='about') ,
    path('',index,name='index') ,
    path('contact',contact,name='contact'),
    path('login',userlogin,name='login'),
    path('login_admin',login_admin,name='login_admin'),
    path('send-otp/', send_otp, name='send_otp'),
    path('check-otp/', check_otp, name='check_otp'),
    path('signup',signup1,name="signup"),
    path('admin_home',admin_home,name="admin_home"),
    path('logout',Logout,name="logout"),
    path('profile',profile,name="profile"),
    path('changepassword',changepassword,name="changepassword"),
    path('Forgot_Password',Forgot_Password,name="Forgot_Password"),
    path('edit_profile',edit_profile,name="edit_profile"),
    path('upload_notes',upload_notes,name="upload_notes"),
    path('view_usernotes',view_usernotes,name="view_usernotes"),
    path('pending_notes',pending_notes,name="pending_notes"),
    path('accepted_notes',accepted_notes,name="accepted_notes"),
    path('rejected_notes',rejected_notes,name="rejected_notes"),
    path('all_notes',all_notes,name="all_notes"),
    path('viewall_usernotes',viewall_usernotes,name="viewall_usernotes"),
    path('delete_usernotes/<int:pid>',delete_usernotes,name="delete_usernotes"),
    path('view_users',view_users,name="view_users"),
    path('delete_users/<int:pid>',delete_users,name="delete_users"),
    path('assign_status/<int:pid>',assign_status,name="assign_status"),
    path('delete_notes/<int:pid>',delete_notes,name="delete_notes")
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
