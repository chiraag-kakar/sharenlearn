from json.decoder import JSONDecodeError
from django.contrib.auth.decorators import login_required
import json
from django.core.mail import EmailMultiAlternatives, message, send_mail
from django.core.mail import EmailMessage
from django.http.response import HttpResponse
from django.utils.html import strip_tags
from django.template.loader import render_to_string
from random import randint
import re
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from .models import *
from django.contrib.auth import authenticate, login, logout
import datetime

from django.contrib import messages
from django.db import IntegrityError


from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from hashids import Hashids

import requests

from django.conf import settings
from django.http import JsonResponse
from django.contrib import messages
import re

# Make a regular expression
# for validating an Email
regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'
hashids = Hashids(min_length=45)

def check(email):
    if(re.search(regex, email)):
        return True

    else:
        return False


def index(request):
    if request.user.is_authenticated:
        return redirect('/profile')
    context = {'auth': request.user.is_authenticated}
    return render(request, 'home.html', context)

def about(request):
    return redirect('/#about')

def contact(request):
    if request.method == 'POST':
        name = request.POST['name']
        email = request.POST['email']
        subject = request.POST['subject']
        message = request.POST['message']
        if not request.user.is_authenticated:
            try:
                otp = request.POST["otp"]
                if not (OTPModel.objects.get(user=email).otp == int(otp)):
                    return JsonResponse({"message": "otperror"})
                OTPModel.objects.get(user=email).delete()
            except:
                return JsonResponse({"message": "otperror"})
        if request.user.is_authenticated:
            if not User.objects.filter(username=email).exists():
                return JsonResponse({"message": "notfound"})
        try:
            subject_admin = f"{name}: {subject}"
            html_message_admin = render_to_string('emails/contact_template.html', {'email_to': 'admin', 'name': name, 'email': email, 'subject': subject, 'message': message})
            plain_message_admin = strip_tags(html_message_admin)
            send_mail(subject_admin, plain_message_admin, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER, ], html_message=html_message_admin)
            subject_user = f"Hey {name}, "
            html_message_user = render_to_string('emails/contact_template.html', {'email_to': 'user', 'name': name, 'email': email, 'subject': subject, 'message': message})
            plain_message_user = strip_tags(html_message_user)
            send_mail(subject_user, plain_message_user, settings.EMAIL_HOST_USER, [email, ], html_message=html_message_user)
            messages.success(request, "Thanks for contacting us, we'll reach out to you soon")
            return JsonResponse({"message": "success"})
        except Exception as e:
           return JsonResponse({"message": "error"})
    else:
        if request.user.is_authenticated:
            return render(request, "contact.html", {"email": request.user.username})
        return redirect("/#contact")

def Logout(request):
    try:
        for i in OTPModel.objects.filter(user=request.user.username):
            i.delete()
    except:
        pass
    finally:
        logout(request)
        return redirect('index')



########################################################################################################
###################################        USER        ################################################
########################################################################################################

def send_email(request, user, purpose, url):
    try:
        uid = user.id
        otp = randint(100000, 999999)
        try:
            for i in OTPModel.objects.filter(user=user.username):
                i.delete()
        except:
            pass
        finally:
            OTPModel.objects.create(user=user.username, otp=otp)
            h_uid = hashids.encode(uid + int(str(otp)[0])) #otp logic
            protocol = "https" if request.is_secure() else "http"
            host = request.get_host()
            link = '{}://{}/{}/{}/{}'.format(protocol, host, url, h_uid, hashids.encode(otp))
            if purpose == "activation":
                subject = "Account Activation Mail <sharenlearn>"
                html_message = render_to_string('emails/mail_template.html', {'email_for': 'activation', 'username': user.first_name, 'link': link})
                plain_message = strip_tags(html_message)
            elif purpose == "c-password":
                subject = "Change Password Request <sharenlearn>"
                html_message = render_to_string('emails/mail_template.html', {'email_for': 'c-password', 'username': user.first_name, 'link': link})
                plain_message = strip_tags(html_message)
            else:
                return False
            email_from = settings.EMAIL_HOST_USER
            email_to = [user.username, ]
            try:
                send_mail(subject, plain_message, email_from, email_to, html_message=html_message)
                return True
            except Exception as e:
                if type(e).__name__ == "SMTPRecipientsRefused" and user.email:
                    send_mail(subject, plain_message, email_from, [user.email, ], html_message=html_message)
                    return True
    except:
        return False

def check_token(uid, otp):
    try:
        r_otp = hashids.decode(otp)[0] #received otp
        r_uid = hashids.decode(uid)[0] - int(str(r_otp)[0]) #received uid - retrieving using otp logic
        user = User.objects.get(id=r_uid)
        d_otp = OTPModel.objects.get(user=user.username).otp;
        if (r_otp == d_otp):
            OTPModel.objects.get(user=user.username).delete()
            return True
        else:
            OTPModel.objects.get(user=user.username).delete()
            return False
    except:
        return False

def signup1(request):
    if request.method == 'POST':
        fname = request.POST['fname']
        lname = request.POST['lname']
        email = request.POST['email']
        password = request.POST['password']
        contact = request.POST['contact']
        role = request.POST['role']
        dept = request.POST['dept']
        try:
            user = User.objects.create_user(username=email, password=password, first_name=fname, last_name=lname)
            user.is_active = False
            user.save()
            signup = Signup.objects.create(user=user, contact=contact, branch=dept, role=role)
            signup.save()
            if not send_email(request, user, "activation", "act"):
                messages.error(request, "Account Created, Failed to Send Verification Mail")
                return redirect("login")
            messages.success(request, "Account Created, Verification mail sent to your email")
            return redirect("login")
        except IntegrityError:
            messages.info(request, "Username taken, Try different")
            return render(request, "signup.html")
    if request.user.is_authenticated:
        return redirect('index')
    return render(request, 'signup.html')


def userlogin(request):
    if not request.user.is_authenticated:
        if request.method == "POST":
            captcha_token = request.POST['g-recaptcha-response']
            cap_url = "https://www.google.com/recaptcha/api/siteverify"
            cap_data = {"secret": settings.GOOGLE_RECAPTCHA_SECRET_KEY, "response": captcha_token}
            cap_server_response = requests.post(url=cap_url, data=cap_data)
            cap_json = cap_server_response.json()
            if cap_json['success'] == False:
                return JsonResponse({"message": "caperror"})
            u = request.POST['email']
            p = request.POST['password']
            try:
                user = User.objects.get(username=u)
                if not user.is_active:
                    if not user.check_password(p):
                        return JsonResponse({"message": "wrong"})
                    p = ""
            except:
                try:
                    user = User.objects.get(email=u)
                    if user.is_superuser and user.is_staff:
                        u = user.username
                except:
                    pass
            finally:
                if p == "":
                    try:
                        user = User.objects.get(username=u)
                        if not send_email(request, user, "activation", "act"):
                            return JsonResponse({"message": "erroronotp"})
                        return JsonResponse({"message": "mailsent"})
                    except:
                        return JsonResponse({"message": "notfound"})
                user = authenticate(username=u, password=p)
                s_msg = "Logged in Successfully"
                if user is not None:
                    if user.is_staff:
                        s_msg = "Logged in as Staff Admin"
                    if user.is_superuser:
                        s_msg = "Logged in as Super User Admin"
                    login(request, user)
                    messages.success(request, s_msg)
                    return JsonResponse({"message": "success"})
                else:
                    return JsonResponse({"message": "wrong"})
        return render(request, 'login.html')
    else:
        return redirect('index')

def activate_user(request, uid, otp):
    if not request.user.is_authenticated:
        try:
            r_otp = hashids.decode(otp)[0] #received otp
            r_uid = hashids.decode(uid)[0] - int(str(r_otp)[0]) #received uid - retrieving using otp logic
            user = User.objects.get(id=r_uid)
            d_otp = OTPModel.objects.get(user=user.username).otp;
            if (r_otp == d_otp):
                OTPModel.objects.get(user=user.username).delete()
                user.is_active = True
                user.save()
                return render(request, "auth_page.html", {"success": True})
            else:
                OTPModel.objects.get(user=user.username).delete()
                return render(request, "auth_page.html", {"success": False})
        except:
            return render(request, "auth_page.html", {"success": False})
    return redirect('login')

def profile(request):
    if not request.user.is_authenticated:
        return redirect('login')
    user = User.objects.get(id=request.user.id)
    try:
        data = Signup.objects.get(user=user)
    except Signup.DoesNotExist:
        if user.is_superuser and user.is_staff:
            user.first_name = user.username
            user.save()
            signup = Signup.objects.create(user=user, contact="", branch="", role="")
            signup.save()
            data = Signup.objects.get(user = user)
    d = {'data': data, 'user': user, 'auth': request.user.is_authenticated}
    if (request.user.is_superuser):
        d["admin"] = True
        return render(request, 'profile.html', d)
    if (request.user.is_staff):
        d["staff"] = True
        return render(request, 'profile.html', d)
    return render(request, 'profile.html', d)


def edit_profile(request):
    if not request.user.is_authenticated:
        messages.info(request, "Please login first")
        return redirect('login')
    user = User.objects.get(id=request.user.id)
    data = Signup.objects.get(user=user)
    if request.method == 'POST':
        fname = request.POST['fname']
        lname = request.POST['lname']
        contact = request.POST['contact']
        user.first_name, user.last_name, data.contact = fname, lname, contact
        user.save()
        data.save()
        messages.success(request, "Profile Updated Successfully")
        return redirect('/profile')
    d = {'data': data, 'user': user, 'auth': request.user.is_authenticated}
    return render(request, 'edit_profile.html', d)
    

########################################################################################################
###################################        ADMIN        ################################################
########################################################################################################

def admin_home(request):

    if not request.user.is_staff:
        return redirect('login_admin')

    pn = Notes.objects.filter(status="pending").count()
    an = Notes.objects.filter(status="Accepted").count()
    rn = Notes.objects.filter(status="Rejected").count()
    aln = Notes.objects.all().count()
    d = {'pn': pn, 'an': an, 'rn': rn, 'aln': aln}
    return render(request, 'admin_home.html', d)


def login_admin(request) :
    error = ""

    if request.method == 'POST':
        u = request.POST['uname']
        p = request.POST['pwd']
        user = authenticate(username=u, password=p)
        try:
            if user.is_staff:
                login(request, user)
                error = "no"
                messages.info(request, f'Logged in Successfully')
                return redirect('/admin_home')
            else:
                error = "yes"
                messages.info(request, f'Invalid Login Credentials, Try Again')

        except:
            error = "yes"
            messages.info(request, f'Invalid Login Credentials, Try Again')
    d = {'error': error}
    return render(request, 'login_admin.html', d)

########################################################################################################
########################################################################################################



def update_profile_photo(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({"message": "notlogin"});
        user = User.objects.get(id=request.user.id)
        data = Signup.objects.get(user=user)
        profile = request.FILES['profile']
        data.profile_photo = profile
        data.save();
        return JsonResponse({"message": "OK", "url": data.profile_photo.url})
    return redirect('login')

def delete_profile_photo(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({"message": "notlogin"});
        user = User.objects.get(id=request.user.id)
        data = Signup.objects.get(user=user)
        data.profile_photo = None
        data.save();
        return JsonResponse({"message": "OK"})
    return redirect('login')

def upload_notes(request):
    if not request.user.is_authenticated:
        messages.info(request, "Login to Upload Notes")
        return redirect('login')
    if request.method == 'POST':
        b = request.POST['dept']
        s = request.POST['subject']
        n = request.FILES['file']
        f = request.POST['ftype']
        d = request.POST['desc']
        u = User.objects.filter(username=request.user.username).first()
        try:
            Notes.objects.create(user=u, uploadingdate=datetime.date.today(), branch=b, subject=s,
                                 notesfile=n, filetype=f, description=d, status="Pending")
            messages.success(request, f'Notes Uploaded Successfully')
            return redirect('/view_usernotes/open');
        except:
            messages.error(request, f'Something went wrong, Try Again')

    return render(request, 'upload_notes.html', {'auth': request.user.is_authenticated})


def delete_usernotes(request, pid):
    if not request.user:
        return redirect('login')
    notes = Notes.objects.get(id=pid)
    notes.delete()
    messages.info(request, f'Deleted Successfully')
    return redirect('/view_usernotes/open')


def view_users(request):
    if not request.user.is_staff:
        return redirect('login')
    users = Signup.objects.all()

    d = {'users': users}
    return render(request, 'view_users.html', d)


def delete_users(request, pid):
    if not request.user:
        return redirect('login')
    users = User.objects.get(id=pid)
    users.delete()
    return redirect('view_users')


def pending_notes(request):
    if not request.user.is_authenticated:
        return redirect('login_admin')

    notes = Notes.objects.filter(status="pending")
    d = {'notes': notes, }
    return render(request, 'pending_notes.html', d)

def accepted_notes(request):
    if not request.user.is_authenticated:
        return redirect('login_admin')
    notes = Notes.objects.filter(status="Accepted")
    d = {'notes': notes}
    return render(request, 'accepted_notes.html', d)


def rejected_notes(request):
    if not request.user.is_authenticated:
        return redirect('login_admin')
    notes = Notes.objects.filter(status="Rejected")
    d = {'notes': notes}
    return render(request, 'rejected_notes.html', d)


def all_notes(request):
    if not request.user.is_authenticated:
        return redirect('login_admin')
    notes = Notes.objects.all()
    d = {'notes': notes}
    return render(request, 'all_notes.html', d)


def delete_notes(request, pid):
    if not request.user:
        return redirect('login')
    notes = Notes.objects.get(id=pid)
    notes.delete()
    return redirect('all_notes')

def view_usernotes(request, type):
    if not request.user.is_authenticated:
        messages.info(request, "Please login to access your uploads")
        return redirect('login')
    user = User.objects.get(id=request.user.id)
    notes = Notes.objects.filter(user=user)
    reviewed = False
    if type == "reviewed":
        notes = notes.exclude(status="Pending")
        reviewed = True
    else:
        notes = notes.filter(status="Pending")
    for i in notes:
        i.liked_note = i in Signup.objects.get(user=request.user).liked.all()
        i.disliked_note = i in Signup.objects.get(user=request.user).disliked.all()
        i.l_count = len(i.likes.all())
        i.dl_count = len(i.dislikes.all())
    l_pen = len(Notes.objects.filter(user=user, status="Pending"))
    l_rev = len((Notes.objects.filter(user=user)).exclude(status="Pending"))
    d = {'notes': notes, 'self': True, 'reviewed': reviewed, 'l_rev': l_rev, 'l_pen': l_pen }
    return render(request, 'viewall_usernotes.html', d)

def viewall_usernotes(request):
    if not request.user.is_authenticated:
        messages.info(request, "Please login to access all uploads")
        return redirect('login')
    notes = Notes.objects.filter(status="Accepted")
    for i in notes:
        try:
            i.profile = Signup.objects.get(user=i.user).profile_photo
            i.liked_note = i in Signup.objects.get(user=request.user).liked.all()
            i.disliked_note = i in Signup.objects.get(user=request.user).disliked.all()
            i.l_count = len(i.likes.all())
            i.dl_count = len(i.dislikes.all())
        except Exception as e:
            print(e)
            i.profile = None
    d = {'notes': notes, 'viewall': True, 'reviewed': True}
    return render(request, 'viewall_usernotes.html', d)




# AJAX Validations Start Here

def email_validation(request):
    """This function will be used to validate email against a regex pattern as well as to check if a user is already registered."""

    data = json.loads(request.body)
    email = data['email']
    pattern = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if User.objects.filter(username=email).exists():
        return JsonResponse({'email_error': 'You are already registered. Please login to continue.'}, status=409)
    if not bool(re.match(pattern, email)):
        return JsonResponse({'email_pattern_error': 'Please enter a valid email address.'})
    return JsonResponse({'email_valid': True})


def password_validation(request):
    """This function will be used to validate password against a regex pattern."""

    data = json.loads(request.body)
    password = data['password']
    pattern = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&_])(?=\S+$).{8,20}$'
    if bool(re.match(pattern, password)):
        return JsonResponse({'password_valid': True})
    else:
        return JsonResponse({'password_error': 'Password must be 8-20 characters long and must contain atleast one uppercase letter, one lowercase letter, one number(0-9) and one special character(@,#,$,%,&,_)'})
# AJAX Validations End Here

def admin_dashboard(request, type):
    reviewed = False
    if not request.user.is_authenticated:
        return redirect('login')
    if (not request.user.is_staff) and (not request.user.is_superuser):
        return redirect('/profile')
    if type == "reviewed":
        notes = Notes.objects.exclude(status="Pending")
        reviewed = True
    else:
        notes = Notes.objects.filter(status="Pending")
    l_pen = len(Notes.objects.filter(status="Pending"))
    l_rev = len(Notes.objects.exclude(status="Pending"))
    for i in notes:
        try:
            i.profile = Signup.objects.get(user=i.user).profile_photo
            i.liked_note = i in Signup.objects.get(user=request.user).liked.all()
            i.disliked_note = i in Signup.objects.get(user=request.user).disliked.all()
            i.l_count = len(i.likes.all())
            i.dl_count = len(i.dislikes.all())
        except:
            i.profile = None
    d = {'notes': notes, 'auth': request.user.is_authenticated, 'staff': request.user.is_staff, 'l_pen': l_pen, 'l_rev': l_rev, 'reviewed': reviewed, 'admin_page': True}
    return render(request, 'viewall_usernotes.html', d)

def superadmin_dashboard(request, type):
    if request.user.is_authenticated and request.user.is_superuser:
        basic_users = [i.id for i in User.objects.filter(is_staff=False, is_superuser=False)]
        staff_users = [i.id for i in User.objects.filter(is_staff=True, is_superuser=False)]
        admin_users = [i.id for i in User.objects.filter(is_superuser=True)]
        signed = Signup.objects.all()
        basic_s_users = list(filter(lambda x: x.user.id in basic_users, signed))
        staff_s_users = list(filter(lambda x: x.user.id in staff_users, signed))
        admin_s_users = list(filter(lambda x: x.user.id in admin_users, signed))
        d = {'users': basic_s_users if type == "basic" else staff_s_users if type == "staff" else admin_s_users if type == "admin" else basic_s_users, 'auth': request.user.is_authenticated, 'admin': request.user.is_superuser, 'sta': len(staff_s_users), 'adm': len(admin_s_users), 'bas': len(basic_s_users), 'type': "admin" if type == "admin" else "staff" if type == "staff" else "basic"}
        return render(request, "superadmin_dashboard.html", d)
    if not request.user.is_superuser:
        return redirect('/profile')
    return redirect("login")

def assign_status(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({"message": "notlogin"})
        if not request.user.is_staff and not request.user.is_superuser:
            return JsonResponse({"message": "notstaff"})
        sid = request.POST["job"]
        pid = request.POST["id"]
        if not (sid == "accept" or sid == "reject"):
            return JsonResponse({"message": "wentwrong"})
        notes = Notes.objects.get(id=pid)
        try:
            if sid == "accept":
                notes.status = "Accepted"
            else:
                notes.status = "Rejected"
            notes.save()
            return JsonResponse({"message": "success"})
        except:
            return JsonResponse({"message": "wentwrong"})
    return HttpResponse("<h1>UnAuthorised</h1>")


def manage_users(request, job):
    if request.method == "POST":
        if request.user.is_authenticated and request.user.is_superuser:
            uid = request.POST["uid"]
            if job == "delete":
                User.objects.get(id=uid).delete()
            else:
                user = User.objects.get(id=uid)
                if job == "m_staff":
                    user.is_staff = True
                elif job == "d_staff":
                    user.is_staff = False
                elif job == "m_admin":
                    user.is_superuser = True
                elif job == "d_admin":
                    user.is_superuser = False
                elif job == "deactivate":
                    user.is_active = False
                elif job == "activate":
                    user.is_active = True
                else:
                    return JsonResponse({"message": "wentwrong"})
                user.save()
            return JsonResponse({"message": "success", "job": job})
        if not request.user.is_superuser:
            return JsonResponse({"message": "notsuperuser"})
        return JsonResponse({"message": "notlogin"})
    return HttpResponse("<h1>UnAuthorised..</h1>")

def forgot_password(request):
    if request.user.is_authenticated:
        return redirect('/profile')
    if request.method == "POST":
        email = request.POST["email"]
        sUser = False
        try:
            try:
                user = User.objects.get(username=email)
            except:
                user = User.objects.get(email=email)
                if not (user.is_superuser and user.is_staff):
                     return JsonResponse({"message": "notfound"})
                sUser = True
            otp = randint(100000, 999999)
            try:
                try:
                    for i in OTPModel.objects.filter(user=user.username):
                        i.delete()
                except:
                    pass
                finally:
                    OTPModel.objects.create(user=user.username, otp=otp)
                    subject = 'Forgot Password: Here\'s your Password Reset Code <sharenlearn>'
                    html_message = render_to_string('emails/mail_template.html', {'email_for': 'f-password', 'username': user.first_name, 'otp': otp})
                    plain_message = strip_tags(html_message)
                    email_from = settings.EMAIL_HOST_USER
                    email_to = [user.username, ] if not sUser else [user.email, ]
                    send_mail(subject, plain_message, email_from, email_to, html_message=html_message)
                    return JsonResponse({"message": "success"})
            except:
                return JsonResponse({"message": "erroronotp"})
        except:
            return JsonResponse({"message": "notfound"})
    return render(request, 'forgot_password.html')

def check_otp(request):
    if request.method == "POST" and not request.user.is_authenticated:
        email = request.POST["email"]
        otp = request.POST["otp"]
        try:
            try:
                user = User.objects.get(username=email)
            except:
                user = User.objects.get(email=email)
                if not (user.is_superuser and user.is_staff):
                     return JsonResponse({"message": "notfound"})
            try:
                d_otp = OTPModel.objects.get(user=user.username).otp
                try:
                    otp = int(otp)
                    if otp == d_otp:
                        return JsonResponse({"message": "success"})
                    return JsonResponse({"message": "wrong"})
                except:
                    return JsonResponse({"message": "wrong"})
            except:
                return JsonResponse({"message": "wentwrong"})
        except:
            return JsonResponse({"message": "notfound"})
    return HttpResponse("<h1>UnAuthorised</h1>")

def set_new_password(request):
    if request.method == "POST" and not request.user.is_authenticated:
        email = request.POST["email"]
        otp = request.POST["otp"]
        np = request.POST["np"]
        sUser = False
        try:
            try:
                user = User.objects.get(username=email)
            except:
                user = User.objects.get(email=email)
                if not (user.is_superuser and user.is_staff):
                     return JsonResponse({"message": "notfound"})
                sUser = True
            try:
                if int(otp) == OTPModel.objects.get(user=user.username).otp:
                    p_set = False
                    try:
                        user.set_password(np)
                        user.save()
                        p_set = True
                        return JsonResponse({"message": "success"})
                    except:
                        return JsonResponse({"message": "cantset"})
                    finally:
                        try:
                            if p_set:
                                subject = "Your ShareNLearn Password Changed <sharenlearn>"
                                html_message = render_to_string('emails/mail_template.html', {'email_for': 'pass-changed', 'username': user.first_name, 'time': datetime.datetime.now()})
                                plain_message = strip_tags(html_message)
                                email_from = settings.EMAIL_HOST_USER
                                email_to = [user.username, ] if not sUser else [user.email, ]
                                send_mail(subject, plain_message, email_from, email_to, html_message=html_message)
                        except:
                            pass
            except:
                return JsonResponse({"message": "wentwrong"})
            finally:
                OTPModel.objects.get(user=user.username).delete()
        except:
            return JsonResponse({"message": "notfound"})
    return HttpResponse("<h1>UnAuthorised</h1>")

def change_password(request):
    if request.user.is_authenticated and request.method == "POST":
        user = User.objects.get(id=request.user.id)
        if send_email(request, user, "c-password", "cp"):
            return JsonResponse({"message": "success"})
        return JsonResponse({"message": "wrong"})
    return redirect("login")

def cp(request, uid, otp):
    if request.user.is_authenticated:
        if check_token(uid, otp):
            d = {'auth': request.user.is_authenticated, 'staff': request.user.is_staff, 'admin': request.user.is_superuser}
            return render(request, "change_password.html", d)
        messages.error(request, "Link Expired")
    return redirect('/profile')

def check_u_password(request):
    if request.user.is_authenticated and request.method == "POST":
        p = request.POST["cp"]
        if request.user.check_password(p):
            return JsonResponse({"message": "success"})
        return JsonResponse({"message": "wrong"})
    return HttpResponse("<h1>UnAuthorised</h1>")

def set_u_password(request):
    if request.user.is_authenticated and request.method == "POST":
        cp = request.POST["cp"]
        np = request.POST["np"]
        if request.user.check_password(cp):
            p_set = False
            try:
                request.user.set_password(np)
                request.user.save()
                p_set = True
                user = authenticate(username=request.user.username, password=np)
                if user is not None:
                    login(request, user)
                    return JsonResponse({"message": "success"})
                return JsonResponse({"message": "error"})
            except:
                return JsonResponse({"message": "error"})
            finally:
                try:
                    if p_set:
                        subject = "Your ShareNLearn Password Changed <sharenlearn>"
                        html_message = render_to_string('emails/mail_template.html', {'email_for': 'pass-changed', 'username': user.first_name, 'time': datetime.datetime.now()})
                        plain_message = strip_tags(html_message)
                        email_from = settings.EMAIL_HOST_USER
                        email_to = [user.username, ]
                        try:
                            send_mail(subject, plain_message, email_from, email_to, html_message=html_message)
                        except Exception as e:
                            if type(e).__name__ == "SMTPRecipientsRefused" and user.email:
                                send_mail(subject, plain_message, email_from, [user.email, ], html_message=html_message)
                except:
                    pass
        return JsonResponse({"message": "wrong"})
    return HttpResponse("<h1>UnAuthorised</h1>")

def send_otp_basic(request):
    if not request.user.is_authenticated and request.method == "POST":
        email = request.POST["email"]
        try:
            otp = randint(100000, 999999)
            try:
                for i in OTPModel.objects.filter(user=email):
                    i.delete()
            except:
                pass
            finally:
                OTPModel.objects.create(user=email, otp=otp)
                subject = "OTP to contact sharenlearn"
                html_message = render_to_string('emails/mail_template.html', {'email_for': 'to-contact', 'username': email, 'otp': otp})
                plain_message = strip_tags(html_message)
                send_mail(subject, plain_message, settings.EMAIL_HOST_USER, [email, ], html_message=html_message)
                return JsonResponse({"message": "success"})
        except Exception as e:
            print(e)
            return JsonResponse({"message": "erroronotp"})

def view_note(request, id):
    if not request.user.is_authenticated:
        return redirect('login')
    try:
        note = Notes.objects.get(id=id)
        try:
            note.profile = Signup.objects.get(user=note.user).profile_photo
            note.liked_note = note in Signup.objects.get(user=request.user).liked.all()
            note.disliked_note = note in Signup.objects.get(user=request.user).disliked.all()
            note.l_count = len(note.likes.all())
            note.dl_count = len(note.dislikes.all())
            note.own = (note.user.id == request.user.id)
        except:
            note.profile = None
        d = {'note': note}
        return render(request, "view_note.html", d)
    except:
        return HttpResponse("Resource you're looking for is not available now")
    
def like(request):
    if request.method == "POST" and request.user.is_authenticated:
        user = Signup.objects.get(user=request.user)
        nid = request.POST["nid"]
        note = Notes.objects.get(id=nid)
        user_in_dislikes = user in note.dislikes.all()
        user_in_likes = user in note.likes.all()
        if user_in_dislikes:
            note.dislikes.remove(user)
            note.likes.add(user)
            job = "like"
            note.save()
        else:
            if user_in_likes:
                note.likes.remove(user)
                job = "unlike"
            else:
                note.likes.add(user)
                job = "like"
            note.save()
        return JsonResponse({"message": "success", "job": job, "l_count": len(note.likes.all()), "dl_count": len(note.dislikes.all())})

def dislike(request):
    if request.method == "POST" and request.user.is_authenticated:
        user = Signup.objects.get(user=request.user)
        nid = request.POST["nid"]
        note = Notes.objects.get(id=nid)
        user_in_dislikes = user in note.dislikes.all()
        user_in_likes = user in note.likes.all()
        if user_in_likes:
            note.likes.remove(user)
            note.dislikes.add(user)
            job = "dislike"
            note.save()
        else:
            if user_in_dislikes:
                note.dislikes.remove(user)
                job = "undislike"
            else:
                note.dislikes.add(user)
                job = "dislike"
            note.save()
        return JsonResponse({"message": "success", "job": job, "l_count": len(note.likes.all()), "dl_count": len(note.dislikes.all())})
