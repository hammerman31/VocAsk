"""
Django views for accounts app.

"""
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout


def signup_view(request):
    """
    Display a User creation form that logs User in after creation.

    **Context**

    ``form``
        An instance of: `UserCreationForm`.

    ``user``
        User credentials.

    **Template**

    :template:`accounts/signup.html`
    :template:`main/static/templates/index.html`

    """
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # log user in
            login(request, user)
            return redirect("index")
    else:
        form = UserCreationForm()
    return render(request, "accounts/signup.html", {"form": form})


def login_view(request):
    """
    Display an authentication form for users to log in.

    **Context**

    ``form``
        An instance of: `AuthenticationForm`.

    ``user``
        User credentials.

    **Template**

    :template:`accounts/login.html`
    :template:`main/static/templates/index.html`

    """
    if request.method == "POST":
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            # log user in
            user = form.get_user()
            login(request, user)
            return redirect("index")
    else:
        form = AuthenticationForm()
    return render(request, "accounts/login.html", {"form": form})


def logout_view(request):
    """
    Log users out.

    **Template**

    :template:`main/static/templates/index.html`

    """
    if request.method == "POST":
        logout(request)
        return redirect("index")
