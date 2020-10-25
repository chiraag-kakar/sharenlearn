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

urlpatterns = [
    path('admin/', admin.site.urls),
    path('about',about,name='about') ,
    path('',index,name='index') ,
    path('contact',contact,name='contact'),
    path('login',userlogin,name='login'),
    path('login_admin',login_admin,name='login_admin'),
    path('signup',signup1,name="signup"),
    path('admin_home',admin_home,name="admin_home"),
    path('logout',Logout,name="logout"),
    path('profile',profile,name="profile")
]
