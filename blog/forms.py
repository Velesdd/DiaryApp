from django import forms
from django.forms.widgets import FileInput, CheckboxInput
from django_toggle_switch_widget.widgets import DjangoToggleSwitchWidget
from .models import *


class PostForm(forms.ModelForm):

        title = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Title'}), required=False)
        text = forms.CharField(widget=forms.Textarea(attrs={'placeholder': 'Text'}))
        # image = forms.ImageField(widget=forms.FileInput(attrs={'placeholder': 'Text'}), required=False)

        class Meta:
            model = Post
            fields = ('title', 'text', 'image')
            widgets = {
                'image': FileInput(),
            }


class TestForm(forms.ModelForm):

    # hidden_note = forms.CharField(widget=forms.CheckboxInput(attrs={'id': 'checkbox_id'}), required=False)
    # theme = forms.CharField(widget=forms.CheckboxInput(attrs={'id': 'checkbox_id'}), required=False)

    class Meta:
        model = Setting
        fields = ('hidden_note', 'wallpaper', 'theme')
        widgets = {
            'wallpaper': FileInput(),
            'hidden_note': CheckboxInput(attrs={'id': 'hidden_note_id'}),
            'theme': CheckboxInput(attrs={'id': 'theme_id'}),
        }
