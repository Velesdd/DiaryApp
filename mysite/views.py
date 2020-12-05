from django.views.generic import TemplateView
from blog.forms import *
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from blog.models import *
from django.http import JsonResponse
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.shortcuts import redirect
from django.views.generic import ListView, DetailView
from django.contrib.auth import logout
from PIL import Image


class StartPage(TemplateView):
    template_name = "index.html"

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('home')

        return render(request, self.template_name)


class SettingFunc(TemplateView):
    template_name = "setting.html"

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            if Setting.objects.filter(author=request.user.id).exists():
                s = get_object_or_404(Setting, author=request.user.id)
                form = TestForm(request.POST or None, request.FILES or None, instance=s)
            else:
                form = TestForm(request.POST, request.FILES)
            if request.method == "POST":
                if form.is_valid():
                    if Setting.objects.filter(author=request.user.id).exists():
                        setting_edit = form.save()
                        setting_edit.save()
                    else:
                        s = Setting()
                        s.author = request.user
                        s.hidden_note = form.cleaned_data['hidden_note']
                        s.theme = form.cleaned_data['theme']
                        s.wallpaper = form.cleaned_data['wallpaper']
                        s.save()
                    return redirect('home')
                else:
                    print("error")
            if not Setting.objects.filter(author=request.user.id).exists():
                form = TestForm()
            return render(request, self.template_name, {'form': form})
        else:
            return redirect('log_in')


class Home(TemplateView):
    template_name = "home.html"

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            if Setting.objects.filter(author=request.user.id).exists():
                setting = Setting.objects.get(author=request.user.id)
                theme = setting.theme
            else:
                theme = False

            return render(request, self.template_name, {'theme': theme})

        else:
            return redirect('log_in')


def home_ajax(request):
    if request.is_ajax():
        if request.method == 'GET':
            if Note.objects.filter(author=request.user.id).exists():
                note = Note.objects.get(author=request.user.id)
                text = note.text
            else:
                text = "Add your note~"
            if Setting.objects.filter(author=request.user.id).exists():
                setting = list(Setting.objects.values().filter(author=request.user.id))
            else:
                setting = ""
            if Goal.objects.filter(author=request.user).exists():
                goals = list(Goal.objects.values().filter(author=request.user).order_by('-done'))
            else:
                goals = ""
            if Post.objects.filter(author=request.user).exists():
                posts = list(Post.objects.values().filter(author=request.user))
            else:
                posts = ""
            return JsonResponse({'text': text, 'posts': posts, 'goals': goals, 'setting': setting})
        if request.method == 'POST':
            if Note.objects.filter(author=request.user.id).exists():
                Note.objects.filter(author=request.user.id).delete()
            text = request.POST.get('text')
            note = Note()
            note.text = text
            note.author = request.user
            note.save()
            return HttpResponse()


def post_new(request):
    if request.method == "POST":
        form = PostForm(request.POST, request.FILES)
        if form.is_valid():
            p = Post()
            p.author = request.user
            p.title = form.cleaned_data['title']
            p.text = form.cleaned_data['text']
            p.published_date = timezone.now()
            p.image = form.cleaned_data['image']
            p.save()
            return redirect('home')
        else:
            print("error")
    form = PostForm()
    if Setting.objects.filter(author=request.user.id).exists():
        setting = Setting.objects.get(author=request.user.id)
        theme = setting.theme
    else:
        theme = False
    return render(request, 'new_post.html', {'form': form, 'theme': theme})


def post_detail(request, pk):
    template_name = "post.html"
    if request.user.is_authenticated:
        if request.is_ajax():
            if request.method == 'GET':
                post = Post.objects.get(pk=pk)
                image = post.image
                if image:
                    im = Image.open(image)
                    (width, height) = im.size
                    return JsonResponse({'width': width, 'height': height})
                return JsonResponse({'width': 0, 'height': 0})
        post = get_object_or_404(Post, pk=pk)
        if Setting.objects.filter(author=request.user.id).exists():
            setting = Setting.objects.get(author=request.user.id)
            theme = setting.theme
        else:
            theme = False
        return render(request, template_name, {'post': post, 'theme': theme})
    else:
        return redirect('log_in')


def post_edit(request, pk):
    if request.user.is_authenticated:
        post = get_object_or_404(Post, pk=pk)
        if request.method == "POST":
            form = PostForm(request.POST or None, request.FILES or None, instance=post)
            if form.is_valid():
                post_edit = form.save(commit=False)
                post_edit.published_date = timezone.now()
                post_edit.save()
                return redirect('post_detail', pk=post_edit.pk)
        else:
            form = PostForm(instance=post)
            if Setting.objects.filter(author=request.user.id).exists():
                setting = Setting.objects.get(author=request.user.id)
                theme = setting.theme
            else:
                theme = False
            return render(request, 'new_post.html', {'form': form, 'theme': theme})
    else:
        return redirect('log_in')


def post_delete(request, pk):
    if request.user.is_authenticated:
        post = get_object_or_404(Post, pk=pk)
        if request.method == "GET":
            post = Post.objects.get(pk=pk)
            post.delete()
            return redirect('home')
        else:
            form = PostForm(instance=post)
        return render(request, 'post.html', {'form': form})
    else:
        return redirect('log_in')


def gallery(request):
    if request.user.is_authenticated:
        if request.is_ajax():
            if request.method == 'GET':
                if Post.objects.filter(author=request.user).exists():
                    posts = list(Post.objects.values().filter(author=request.user))
                    return JsonResponse({'posts': posts})


@csrf_exempt
def add_goal(request):
    if request.user.is_authenticated:
        if request.is_ajax():
            if request.method == 'POST':
                text = request.POST.get('text')
                goal = Goal()
                goal.text = text
                goal.author = request.user
                goal.save()
                goal_one = list(Goal.objects.filter(pk=goal.pk).values())
                return JsonResponse({'goal': goal_one})
    else:
        return redirect('log_in')


@csrf_exempt
def delete_goal(request):
    if request.user.is_authenticated:
        if request.is_ajax():
            if request.method == 'POST':
                goal_id = request.POST.get('goal_id')
                goal = Goal.objects.get(id=goal_id)
                goal.delete()
                return HttpResponseRedirect("/")
    else:
        return redirect('log_in')


@csrf_exempt
def edit_goal(request):
    if request.user.is_authenticated:
        if request.is_ajax():
            if request.method == 'POST':
                goal_id = request.POST.get('goal_id')
                goal = Goal.objects.get(id=goal_id)
                done = request.POST.get('done')
                if done == "false":
                    goal.done = False
                else:
                    goal.done = True
                goal.save()
                return HttpResponse()
    else:
        return redirect('log_in')


def logout_view(request):
    logout(request)
    return redirect('/')
