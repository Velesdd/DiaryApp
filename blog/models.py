from django.conf import settings
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
# Create your models here.


class Note(models.Model):
    author = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    text = models.CharField(max_length=500, verbose_name=u"Текст", null=True, blank=True)

    objects = models.Manager()


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=u"Автор", related_name="posts")
    title = models.CharField(max_length=200, default="", blank=True)
    text = models.TextField()
    published_date = models.DateTimeField(blank=True, null=True)
    image = models.ImageField(null=True, blank=True, upload_to="images/")

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    objects = models.Manager()


class Goal(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=u"Автор", related_name="goals")
    text = models.CharField(max_length=200, default="", blank=True)
    done = models.BooleanField(default=True)

    objects = models.Manager()


class Setting(models.Model):
    author = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    hidden_note = models.BooleanField(null=True, blank=True)
    wallpaper = models.ImageField(null=True, blank=True, upload_to="wallpapers/")
    theme = models.BooleanField(null=True, blank=True)

    objects = models.Manager()
