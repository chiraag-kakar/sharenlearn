from django.shortcuts import render

# Create your views here.
def about(request):
    return render(request,'about.html')

def index(request) :
    return render(request, 'index.html')

def contact(request) :
    return render(request, 'contact.html')

def login(request) :
    return render(request, 'login.html')

def login_admin(request) :
    return render(request, 'login_admin.html')

def signup(request) :
    return render(request, 'signup.html')
