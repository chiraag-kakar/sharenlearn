from django.shortcuts import render
from django.contrib.auth.models import User
from .models import *
from django.contrib.auth import authenticate, login
# Create your views here.
def about(request):
    return render(request,'about.html')

def index(request) :
    return render(request, 'index.html')

def contact(request) :
    return render(request, 'contact.html')

def userlogin(request) :
    return render(request, 'login.html')

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

def signup(request) :
    return render(request, 'signup.html')

def admin_home(request) :
    if not request.user.is_staff:
        return redirect('login_admin')
    return render(request, 'admin_home.html')
