//Declaring instance constants, the ID equals the window URL, the TYPE equals the platform i.e docs, campfirewriting etc.
const INSTANCE_ID = locationHelper.ID
const INSTANCE_TYPE = locationHelper.TYPE

//Creating Penspyre UI Elements, some will stay hidden until triggered but all must be declared
setTimeout(() => {
    LaunchButton.create("launchButton-1", locationHelper.FORMAT.buttonLocation);
    LaunchButton.setOnClick("launchButton-1", INSTANCE_TYPE, INSTANCE_ID, "sidebar-1");
    Popup.create("popup-1",locationHelper.FORMAT.buttonLocation, INSTANCE_ID);
}, "2000")

Sidebar.create("sidebar-1", locationHelper.FORMAT.sidebarLocation);

Menu.create("menu-1","sidebar-1");
IdeaSettings.create("ideasettings-1","sidebar-1", INSTANCE_TYPE, INSTANCE_ID, ImageToggle.checkGenerationStyleFunction, "imageToggle-1");

Prompt.create("prompt-1","sidebar-1")
Prompt.create("prompt-2","sidebar-1")
Prompt.create("prompt-3","sidebar-1")
ImageToggle.create("imageToggle-1","sidebar-1");
Settings.create("settings-1", "sidebar-1", INSTANCE_ID);

LoadingScreen.create("loadingScreen-1", "sidebar-1")
Message.create("message-1","sidebar-1")

