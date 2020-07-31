export function getStatus(
  quantity?: number,
  minimumThreshold?: number,
  actionStatus?: string,
): string {
  let status = 'Active';
  if (quantity) {
    if (minimumThreshold) {
      if (quantity <= minimumThreshold) {
        status = 'Low Stock';
      }
    }
  } else {
    // if (actionStatus === 'Discontinued') {
    //   status = actionStatus;
    // }
    status = 'Out of Stock';
  }

  return status;
}
