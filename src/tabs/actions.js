import { DeviceApi } from "../api";
import { Components, Icons } from "../components";
import { toast } from "../toast";

const createDialogContent = (name, callDelay, closeDialog) => {
  const container = Components.container()
  container.onclick = (e) => e.stopPropagation()

  const saveValue = async (value) => {
    if (value < 0) {
      input.classList.add("required")
      toast.error({ caption: "Delay can't be negative" })
    } else {
      DeviceApi.updateActionSchedule(name, value)
        .then(() => {
          toast.success({ caption: value === 0 ? "Delay disabled" : "Delay updated" })
          closeDialog()
        })
        .catch(() => toast.error({ caption: "Failed to update delay" }))
    }
  }

  const id = name + '-action-delay'
  const input = Components.input({
    id,
    label: 'Call every (ms)',
    value: callDelay,
    type: 'number',
    min: 0,
  })
  const disableButton = Components.button({
    label: 'Disable delay',
    onClick: () => confirm("Disable action delay?") && saveValue(0),
    danger: true
  })
  const button = Components.button({
    label: 'Save',
    onClick: () => saveValue(Number(document.getElementById(id)?.value ?? 0))
  })

  const controls = Components.controlsHolder()
  controls.append(disableButton, button)

  container.append(input, controls)

  return container
}

export const ActionsTab = {
  name: "Actions",
  content: async () => {
    const actions = await DeviceApi.actions()
      .then(({ data }) => data)
      .catch(() => toast.error({ caption: "Failed to load actions" }));
    if (!actions) {
      return Components.header("No actions configured");
    }
    const div = Components.list();
    actions.forEach(({ name, caption, callDelay, lastCall }) => {
      const container = Components.container()
      container.classList.add('action-container')
      
      const button = Components.button({
        id: "action_" + name,
        label: caption,
        title: `System name: ${name}${callDelay > 0 ? '\nLast call ms ago: ' + lastCall : ''}`,
        labelElement: "h1",
        onClick: () => DeviceApi.callAction(name)
          .then(() => toast.success({ caption: "Done" }))
          .catch(() => toast.error({ caption: `Failed to perform action "${caption}"` }))
      })
      button.style.width = "100%"
      container.append(button)

      if (window.features?.actionsScheduler) {
        const [dialog, openDialog, closeDialog] = Components.dialog({ id: 'dialog-' + name })
        dialog.append(createDialogContent(name, callDelay, closeDialog))
        
        container.append(
          Components.icon({
            icon: Icons.timer,
            onClick: openDialog
          }),
          dialog,
        )
      }
      
      div.append(container);
    });
    div.style.padding = "2px";
    return div;
  },
};
