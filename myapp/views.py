from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from .models import *
from django.contrib.auth import authenticate, login, logout
# Create your views here.
def about(request):
    return render(request,'about.html')

def index(request) :
    return render(request, 'index.html')

def contact(request) :
    return render(request, 'contact.html')

def Logout(request) :
    logout(request)
    return redirect('index')

def userlogin(request) :
    error=""
    if request.method == 'POST':
        u = request.POST['emailid']
        p = request.POST['pwd']
        user = authenticate(username=u, password=p)
        try:
            if user:
                login(request, user)
                error = "no"
            else:
                error = "yes"
        except:
            error = "yes"
    d = {'error':error}
    return render(request, 'login.html',d)

def login_admin(request) :
    error=""
    if request.method == 'POST':
        u = request.POST['uname']
        p = request.POST['pwd']
        user = authenticate(username=u, password=p)
        try:
            if user.is_staff:
                login(request, user)
                error = "no"
            else:
                error = "yes"
        except:
            error = "yes"
    d = {'error':error}
    return render(request, 'login_admin.html',d)

def signup1(request) :
    error=""
    if request.method=='POST':
        f = request.POST['firstname']
        l = request.POST['lastname']
        c = request.POST['contact']
        e = request.POST['emailid']
        p = request.POST['password']
        b = request.POST['branch']
        r = request.POST['role']
        try:
            user = User.objects.create_user(username=e,password=p,first_name=f,last_name=l)
            Signup.objects.create(user=user,emailid=e,contact=c,branch=b,role=r)
            error="no"
        except:
            error="yes"
    d={'error':error}
    return render(request, 'signup.html',d)

def admin_home(request) :
    if not request.user.is_staff:
        return redirect('login_admin')
    return render(request, 'admin_home.html')

def profile(request) :
    if not request.user:
        return redirect('login')
    user = User.objects.get(id=request.user.id)
    data = Signup.objects.get(user = user)
    d = {'data':data,'user':user}
    return render(request, 'profile.html',d)

def edit_profile(request) :
    if not request.user:
        return redirect('login')
    user = User.objects.get(id=request.user.id)
    data = Signup.objects.get(user = user)
    error=False
    if request.method=='POST':
        f=request.POST['firstname']
        l=request.POST['lastname']
        c=request.POST['contact']
        b=request.POST['branch']

        user.first_name=f
        user.last_name=l
        datacontact=c
        data.branch=b

        user.save()
        data.save()
        error=True
    d = {'data':data,'user':user,'error':error}
    return render(request, 'edit_profile.html',d)

def changepassword(request):
    if not request.user:
        return redirect('login')
    error=""
    if request.method=="POST":
        o=request.POST['old']
        n=request.POST['new']
        c=request.POST['confirm']
        if c==n:
            u=User.objects.get(username__exact=request.user.username)
            u.set_password(n)
            u.save()
            error="no"
        else:
            error="yes"
    d={'error':error}
    return render(request, 'changepassword.html',d)
